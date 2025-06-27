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
import Env "env";
import ICRC2Types "models/ICRC2Types";
import Debug "mo:base/Debug";
import Nat64 "mo:base/Nat64";

actor Main {
  type Config = {
    tokenCanister : Principal;
    adminPrincipal : Principal;
  };
  // state
  stable var config : ?Config = null;
  public shared(msg) func initConfig(cfg: Config): async () {
    config := ?cfg;
  };

  private func getConfig(): Config {
    switch (config) {
      case (null) Debug.trap("❌ Config belum diinisialisasi");
      case (?cfg) cfg;
    };
  };

  private func getTokenCanister(): actor {
    icrc1_balance_of: ({ owner: Principal; subaccount: ?[Nat8] }) -> async Nat;
    icrc2_transfer_from: ({
      from: { owner: Principal; subaccount: ?[Nat8] };
      to: { owner: Principal; subaccount: ?[Nat8] };
      amount: Nat;
      spender_subaccount: ?[Nat8];
      fee: ?Nat;
      memo: ?[Nat8];
      created_at_time: ?Nat64;
    }) -> async ICRC2Types.TransferFromResult;
  } {
    let cfg = getConfig();
    actor (Principal.toText(cfg.tokenCanister))
  };

  stable var stableUser: [User.User] = [] : [User.User];
  var userMap : HashMap.HashMap<Principal, User.User> = HashMap.HashMap(0, Principal.equal, Principal.hash);

  stable var stableCampaigns : [Campaign.Campaign] = [] : [Campaign.Campaign];
  var campaignMap : HashMap.HashMap<Nat, Campaign.Campaign> = HashMap.HashMap<Nat, Campaign.Campaign>(0, Nat.equal, Hash.hash);

  stable var stableNFTs: [(Nat, NFT.NFT)] = [];
  var nftMap : HashMap.HashMap<Nat, NFT.NFT> = HashMap.HashMap<Nat, NFT.NFT>(0, Nat.equal, Hash.hash);
  var nextNftId : Nat = 0;

  var campaignCounter : Nat = 0;
  var canisterId: ?Principal = null;
  var icrc37_state: Icrc37Types.CollectionState = ICRC37.initialState();
  private var _icrc37: ?ICRC37.ICRC37 = null;

  var purchaseLogs: [NFT.PurchaseLog] = [];
  stable var stablePurchaseLogs: [NFT.PurchaseLog] = [];

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
        _icrc37 := ?ICRC37.ICRC37(?icrc37_state, cid, env, getConfig().adminPrincipal);
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
            let instance = ICRC37.ICRC37(?icrc37_state, cid, get_icrc37_environment(cid), getConfig().adminPrincipal);
            _icrc37 := ?instance;
            instance;
          };
          case (?cid) {
            let instance = ICRC37.ICRC37(?icrc37_state, cid, get_icrc37_environment(cid), getConfig().adminPrincipal);
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
    for ((id, oldNFT) in stableNFTs.vals()) {
      let migratedNFT: NFT.NFT = {
        id = oldNFT.id;
        campaignId = oldNFT.campaignId;
        ownerId = oldNFT.ownerId;
        level = oldNFT.level;
        metadata = oldNFT.metadata;
        price = oldNFT.price;
        isAvailable = true; 
      };
      nftMap.put(id, migratedNFT);
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
            if (nft.ownerId != Principal.fromActor(Main) or not nft.isAvailable) {
              return #Err("NFT not available for purchase");
            };

            // 1. Cek saldo user
            let account = { owner = caller; subaccount = null };
            let tokenCanister = getTokenCanister();
            let balance = await tokenCanister.icrc1_balance_of(account);

            if (balance < nft.price) {
              return #Err("Insufficient token balance");
            };

            // 2. Transfer token dari user ke canister
            let transferTokenResult = await tokenCanister.icrc2_transfer_from({
              from = { owner = caller; subaccount = null };
              to = { owner = Principal.fromActor(Main); subaccount = null };
              amount = nft.price;
              spender_subaccount = null;
              fee = null;
              memo = null;
              created_at_time = null;
            });

        switch (transferTokenResult) {
          case (#Err(err)) {
            let errMsg = switch (err) {
              case (#GenericError(payload)) "Token transfer failed: " # payload.message;
              case (#InsufficientFunds(payload)) "Insufficient funds: balance = " # Nat.toText(payload.balance);
              case (#InsufficientAllowance(payload)) "Insufficient allowance: " # Nat.toText(payload.allowance);
              case (#BadFee(payload)) "Bad fee, expected: " # Nat.toText(payload.expected_fee);
              case (#TooOld) "Transfer too old";
              case (#TemporarilyUnavailable) "Service temporarily unavailable";
              case (#CreatedInFuture(payload)) "Created in future: " # Nat64.toText(payload.ledger_time);
              case (#Duplicate(payload)) "Duplicate transaction: " # Nat.toText(payload.duplicate_of);
              case (#BadBurn(payload)) "Bad burn: min = " # Nat.toText(payload.min_burn_amount);
            };
            return #Err(errMsg);
          };
          case (#Ok(_)) {
            // 3. Transfer NFT ke user
            let transferArg: Icrc37Types.TransferArg = {
              from = { owner = Principal.fromActor(Main); subaccount = null };
              to = { owner = caller; subaccount = null };
              token_ids = [nft.id];
              memo = null;
              created_at_time = null;
            };

            let result = icrc37().transfer(caller, transferArg);

            switch (result) {
              case (#Ok(_)) {
                let updatedNft = { nft with isAvailable = false; ownerId = caller };
                nftMap.put(nft.id, updatedNft);

                // Simpan log
                purchaseLogs := Array.append(purchaseLogs, [{
                  user = caller;
                  nftId = nft.id;
                  price = nft.price;
                  time = Time.now();
                }]);
              };
              case (#Err(_)) {};
            };

            return result;
          };
        };
      };
    };
  };

    public shared(msg) func adminPurchaseNFT(tokenId: Nat, buyer: Principal): async Icrc37Types.TransferResult {
      let adminPrincipal = getConfig().adminPrincipal;

      if (msg.caller != adminPrincipal) {
        return #Err("Unauthorized bukan admin principal");
      };
      Debug.print("✅ adminPurchaseNFT called by: " # Principal.toText(msg.caller));
      Debug.print("✅ Expected admin: " # Principal.toText(adminPrincipal));

      switch (NFTService.getNFTById(nftMap, tokenId)) {
        case null return #Err("NFT not found");
        case (?nft) {
          if (nft.ownerId != Principal.fromActor(Main) or not nft.isAvailable) {
            return #Err("NFT not available for purchase");
          };

          let transferArg: Icrc37Types.TransferArg = {
            from = { owner = Principal.fromActor(Main); subaccount = null };
            to = { owner = buyer; subaccount = null };
            token_ids = [nft.id];
            memo = null;
            created_at_time = null;
          };

          let result = icrc37().transfer(msg.caller, transferArg); 

          switch (result) {
            case (#Ok(_)) {
              let updatedNft = { nft with isAvailable = false; ownerId = buyer };
              nftMap.put(nft.id, updatedNft);
              purchaseLogs := Array.append(purchaseLogs, [{
                user = buyer;
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

  public query func getAvailableNFTs(): async [NFT.NFT] {
    Array.filter<NFT.NFT>(
      NFTService.getAllNFTs(nftMap),
      func(nft: NFT.NFT) : Bool {
        nft.ownerId == Principal.fromActor(Main) and nft.isAvailable
      }
    )
  };

  public shared(msg) func claimNFT(tokenId: Nat): async Icrc37Types.TransferResult {
    let caller = msg.caller;
    let tokenCanister = getTokenCanister();

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
        let currentBalance = await tokenCanister.icrc1_balance_of(canisterAccount);

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
              let updatedNft = { nft with isAvailable = false; ownerId = caller };
              nftMap.put(nft.id, updatedNft);
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

  public query func getPurchaseLogs() : async [NFT.PurchaseLog] {
    purchaseLogs;
  };

  public shared(msg) func claimInitialToken(): async Result.Result<Text, Text> {
    let caller = msg.caller;

    let amount: Nat = 100_000_000;

    switch (userMap.get(caller)) {
      case null return #err("User belum terdaftar");
      case (?user) {
        if (user.trustPoints > 0) {
          return #err("Token sudah pernah diklaim");
        };

        let token = getTokenCanister();
        let toAccount = {
          owner = caller;
          subaccount = null;
        };

        let transferResult = await token.icrc2_transfer_from({
          from = { owner = getConfig().adminPrincipal; subaccount = null };
          to = toAccount;
          amount = amount;
          spender_subaccount = null;
          fee = null;
          memo = null;
          created_at_time = null;
        });

        switch (transferResult) {
          case (#Ok(_)) {
            let updated = { user with trustPoints = amount };
            userMap.put(caller, updated);
            return #ok("Token berhasil diklaim");
          };
          case (#Err(_)) return #err("Transfer token gagal");
        };
      };
    };
  };

  
  public query func getUserPurchaseLogs(user: Principal) : async [NFT.PurchaseLog] {
    Array.filter<NFT.PurchaseLog>(purchaseLogs, func(log: NFT.PurchaseLog) { log.user == user });
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
