import User "models/User";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import Time "mo:base/Time";
import UserService "services/UserService";
import Campaign "models/Campaign";
import CampaignService "services/CampaignService";
import NFT "models/NFT";
import NFTService "services/NFTService";
import Icrc37Types "models/ICRC37Types";
import Icrc37Environment "services/ICRC37Environment";
import ICRC37 "services/ICRC37";
import Env "env"

actor Main {
  type PurchaseLog = {
    user: Principal;
    nftId: Nat;
    price: Nat;
    time: Int;
  };
  // state
  stable var stableUser: [User.User] = [] : [User.User];
  var userMap : HashMap.HashMap<Principal, User.User> = HashMap.HashMap(0, Principal.equal, Principal.hash);

  stable var stableCampaigns : [Campaign.Campaign] = [] : [Campaign.Campaign];
  var campaignMap : HashMap.HashMap<Nat, Campaign.Campaign> = HashMap.HashMap<Nat, Campaign.Campaign>(0, Nat.equal, Hash.hash);

  stable var stableNFTs : [(Nat, NFT.NFT)] = [];
  var nftMap : HashMap.HashMap<Nat, NFT.NFT> = HashMap.HashMap<Nat, NFT.NFT>(0, Nat.equal, Hash.hash);
  var nextNftId : Nat = 0;

  var campaignCounter : Nat = 0;
  var canisterId: ?Principal = null;
  var icrc37_state: Icrc37Types.CollectionState = ICRC37.initialState();
  private var _icrc37: ?ICRC37.ICRC37 = null;

  var purchaseLogs: [PurchaseLog] = [];
  stable var stablePurchaseLogs: [PurchaseLog] = [];

  let TokenCanister = actor("uzt4z-lp777-77774-qaabq-cai") : actor {
    icrc1_balance_of: ({ owner: Principal; subaccount: ?[Nat8] }) -> async Nat;
  };

  public shared(msg) func initCanisterId(): async () {
    if (canisterId == null) {
      canisterId := ?Principal.fromActor(Main);
    };
  };

  public shared(msg) func initICRC37(): async () {
    switch (canisterId) {
      case (null) {
        return; 
      };
      case (?cid) {
        icrc37_state := ICRC37.init(icrc37_state, #v0_1_0(#id), Icrc37Environment.defaultConfig(), cid);
        let env = get_icrc37_environment(cid);
        _icrc37 := ?ICRC37.ICRC37(?icrc37_state, cid, env);
      };
    };
  };

  private func get_icrc37_environment(cid: Principal): Icrc37Types.Environment {
    Icrc37Environment.getEnv(cid, nftMap, icrc37_state);
  };

  private func icrc37(): ICRC37.ICRC37 {
    switch (_icrc37) {
      case (null) {
        switch (canisterId) {
          case (null) {
            let cid = Principal.fromActor(Main);
            let instance = ICRC37.ICRC37(?icrc37_state, cid, get_icrc37_environment(cid));
            _icrc37 := ?instance;
            instance;
          };
          case (?cid) {
            let instance = ICRC37.ICRC37(?icrc37_state, cid, get_icrc37_environment(cid));
            _icrc37 := ?instance;
            instance;
          };
        }
      };
      case (?val) val;
    };
  };

  for (user in stableUser.vals()) {
    userMap.put(user.id, user);
  };
  
  system func preupgrade() {
    stableUser := Iter.toArray(userMap.vals());
    stableCampaigns := Iter.toArray(campaignMap.vals());
    stableNFTs := Iter.toArray(nftMap.entries());
    stablePurchaseLogs := purchaseLogs;
  };
  
  system func postupgrade() {
    for (user in stableUser.vals()) {
      userMap.put(user.id, user);
    };
    for (campaign in stableCampaigns.vals()) {
      campaignMap.put(campaign.id, campaign);
    };
    for ((id, nft) in stableNFTs.vals()) {
      nftMap.put(id, nft);
    };
    purchaseLogs := stablePurchaseLogs;
    stableUser := [];
    stableCampaigns := [];
    stableNFTs := [];
    stablePurchaseLogs := [];
  };
  
    // NFT
    public shared(msg) func mintRewardNFT(
      campaignId: Nat,
      level: Text,
      metadata: NFT.Metadata,
      price: Nat
    ): async NFT.NFT {
      let caller = msg.caller;
      let (nft, nextId) = NFTService.mintNFT(
        nftMap,
        nextNftId,
        campaignId,
        Principal.fromActor(Main), // Owner awal = canister
        level,
        metadata,
        price
      );
      nextNftId := nextId;
      return nft;
    };

   public shared(msg) func purchaseNFT(tokenId: Nat): async Icrc37Types.TransferResult {
    let caller = msg.caller;

    switch (NFTService.getNFTById(nftMap, tokenId)) {
      case null return #Err("NFT not found");
      case (?nft) {
        if (nft.ownerId != Principal.fromActor(Main)) {
          return #Err("NFT not available for purchase");
        };

        // Cek saldo ICRC-1 user
        let account = { owner = caller; subaccount = null };
        let balance = await TokenCanister.icrc1_balance_of(account);

        if (balance < nft.price) {
          return #Err("Insufficient token balance");
        };

        // Lanjut transfer NFT
        let transferArg: Icrc37Types.TransferArg = {
          from = { owner = nft.ownerId; subaccount = null };
          to = { owner = caller; subaccount = null };
          token_ids = [nft.id];
          memo = null;
          created_at_time = null;
        };

        return icrc37().transfer(caller, transferArg);
      }
    }
  };

  public shared(msg) func claimNFT(tokenId: Nat): async Icrc37Types.TransferResult {
    let caller = msg.caller;

    switch (NFTService.getNFTById(nftMap, tokenId)) {
      case null return #Err("NFT not found");
      case (?nft) {
        if (nft.ownerId != Principal.fromActor(Main)) {
          return #Err("NFT not owned by canister");
        };
        // Ambil saldo canister
        let canisterAccount = {
          owner = Principal.fromActor(Main);
          subaccount = null;
        };
        let currentBalance = await TokenCanister.icrc1_balance_of(canisterAccount);

        if (currentBalance < nft.price) {
          return #Err("Payment not received yet");
        };

        // Transfer NFT ke caller
        let transferArg: Icrc37Types.TransferArg = {
          from = { owner = nft.ownerId; subaccount = null };
          to = { owner = caller; subaccount = null };
          token_ids = [nft.id];
          memo = null;
          created_at_time = null;
        };

        let result = icrc37().transfer(caller, transferArg);
        switch (result) {
            case (#Ok(_)) {
              purchaseLogs := Array.append(purchaseLogs, [{
                user = caller;
                nftId = nft.id;
                price = nft.price;
                time = Time.now();
              }]);
            };
            case _ {};
          };

        return result;
      };
    };
  };

  public shared(msg) func transfer(arg: Icrc37Types.TransferArg): async Icrc37Types.TransferResult {
    return icrc37().transfer(msg.caller, arg);
  };

  public query func getPurchaseLogs() : async [PurchaseLog] {
    purchaseLogs;
  };

  
  public query func getUserPurchaseLogs(user: Principal) : async [PurchaseLog] {
    Array.filter<PurchaseLog>(purchaseLogs, func(log: PurchaseLog) { log.user == user });
  };

  // ICRC-7/ICRC-37 Queries
  public query func icrc37_supported_standards(): async [(Text, Text)] {
    icrc37().supported_standards();
  };

  public query func icrc37_name(): async ?Text {
    icrc37().name();
  };

  public query func icrc37_symbol(): async ?Text {
    icrc37().symbol();
  };

  public query func icrc37_description(): async ?Text {
    icrc37().description();
  };

  public query func icrc37_logo(): async ?Text {
    icrc37().logo();
  };

  public query func icrc37_supply_cap(): async ?Nat {
    icrc37().supply_cap();
  };

  public query func icrc37_total_supply(): async Nat {
    icrc37().total_supply();
  };

  public query func icrc7_tokens(): async [Nat] {
    icrc37().tokens();
  };

  public query func icrc7_owner_of(ids: [Nat]): async [?Principal] {
    return Array.map<Nat, ?Principal>(ids, func(id) {
      icrc37().owner_of(id);
    });
  };

  public query func icrc7_token_metadata(ids: [Nat]): async [?[(Text, Text)]] {
    return Array.map<Nat, ?[(Text, Text)]>(ids, func(id) {
      icrc37().token_metadata(id);
    });
  };

  public query func icrc7_tokens_of(owner: Principal): async [Nat] {
    icrc37().tokens_of(owner);
  };


  // User
  public shared(msg) func registerUser(username : Text) : async Result.Result<User.User, Text> {
    let caller = msg.caller;

    let result = UserService.registerUser(userMap, caller, username);
    switch result {
      case (#ok(newUser)) {
        stableUser := Array.append(stableUser, [newUser]);
        return #ok(newUser);
      };
      case (#err(error)) {
        return #err(error);
      };
    };
  };
  
  public shared(msg) func getUserProfile() : async ?User.User {
    let caller = msg.caller;
    return UserService.getCurrentUser(stableUser, caller);
  };
  
  public query func getUserProfileByUsername(username : Text) : async ?User.User {
    return UserService.getUserByUsername(userMap, username);
  };
  
  // Campaign
  public shared(_) func addCampaign(newCampaign : Campaign.Campaign) : async Result.Result<Campaign.Campaign, Text> {
    campaignCounter += 1;
    let campaignId = campaignCounter;
    let campaignWithId = { newCampaign with id = campaignId };
    return CampaignService.addCampaign(campaignMap, campaignId, campaignWithId);
  };
  
  public shared(_) func updateCampaign(campaignId : Nat, updatedCampaign : Campaign.Campaign) : async Result.Result<Campaign.Campaign, Text> {
    return CampaignService.updateCampaign(campaignMap, campaignId, updatedCampaign);
  };
  
  public shared(_) func deleteCampaign(campaignId : Nat) : async Result.Result<Text, Text> {
    return CampaignService.deleteCampaign(campaignMap, campaignId);
  };
  
  public query func getAllCampaigns() : async [Campaign.Campaign] {
    return CampaignService.getAllCampaign(campaignMap);
  };
  
  public query func getDetailCampaign(campaignId : Nat) : async ?Campaign.Campaign {
    return CampaignService.getDetailCampaign(campaignMap, campaignId);
  };
  
  public query func getUserByPrincipal(p : Principal) : async ?User.User {
    return UserService.getUserByPrincipal(userMap, p);
  };
};
