import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Hash "mo:base/Hash";

import User "models/User";
import Campaign "models/Campaign";
import NFT "models/NFT";
import ICRC37Types "models/ICRC37Types";

import UserService "services/UserService";
import CampaignService "services/CampaignService";
import NFTService "services/NFTService";

actor Main {
  type State = {
    logo: ?Text;
    name: ?Text;
    symbol: ?Text;
    description: ?Text;
    supply_cap: ?Nat;
    deployer: Principal;
    royalties: ?Nat; // Changed from ?() to ?Nat for royalty percentage
    custodians: [Principal];
    allow_transfers: ?Bool;
  };

  // Stable variables for upgrade persistence
  stable var stableUsers: [User.User] = [];
  stable var stableCampaigns: [Campaign.Campaign] = [];
  stable var stableNFTs: [(Nat, NFT.NFT)] = [];
  stable var stableNftNextId: Nat = 0;

  // Runtime HashMaps
  var userMap = HashMap.HashMap<Principal, User.User>(0, Principal.equal, Principal.hash);
  var campaignMap = HashMap.HashMap<Principal, Campaign.Campaign>(0, Principal.equal, Principal.hash);
  var nftMap = HashMap.HashMap<Nat, NFT.NFT>(0, Nat.equal, Hash.hash);
  var nftNextId: Nat = stableNftNextId;

  // ICRC37 state
  stable var icrc37_state: State = {
    logo = ?"https://example.com/logo.png";
    name = ?"Fundasi NFT Collection";
    symbol = ?"FUND";
    description = ?"NFTs for UMKM supporters";
    supply_cap = ?1000;
    deployer = Principal.fromText("rdmx6-jaaaa-aaaah-qcaiq-cai"); // Replace with actual principal
    royalties = ?250; // 2.5% royalty (250 basis points)
    custodians = [];
    allow_transfers = ?true;
  };

  // ICRC37 environment function
  private func get_icrc37_environment() : {
    canister: Principal;
    get_time: () -> Int;
    refresh_state: () -> State;
    icrc7: {
      tokens: () -> [Nat];
      owner_of: (Nat) -> ?Principal;
      transfer_from: ?((Principal, ICRC37Types.TransferArg) -> ICRC37Types.TransferResult);
    };
    token_metadata: (Nat) -> ?[(Text, Text)];
    tokens_of: (Principal) -> [Nat];
    add_ledger_transaction: (Text) -> (); // Changed from any to Text
  } {
    {
      canister = Principal.fromActor(Main);
      get_time = Time.now;
      refresh_state = func () : State = icrc37_state;
      icrc7 = {
        tokens = func () : [Nat] = Iter.toArray(nftMap.keys());
        owner_of = func (id: Nat) : ?Principal {
          switch (nftMap.get(id)) {
            case null { null };
            case (?nft) { ?nft.ownerId };
          }
        };
        transfer_from = null;
      };
      token_metadata = func(id: Nat) : ?[(Text, Text)] {
        NFTService.getMetadataFor(nftMap, id);
      };
      tokens_of = func(owner: Principal) : [Nat] {
        NFTService.tokensOf(nftMap, owner);
      };
      add_ledger_transaction = func (_tx: Text) {};
    }
  };

  // System functions for upgrades
  system func preupgrade() {
    stableUsers := Iter.toArray(userMap.vals());
    stableCampaigns := Iter.toArray(campaignMap.vals());
    stableNFTs := Iter.toArray(nftMap.entries());
    stableNftNextId := nftNextId;
  };

  system func postupgrade() {
    // Restore users
    for (u in stableUsers.vals()) {
      userMap.put(u.id, u);
    };
    
    // Restore campaigns
    for (c in stableCampaigns.vals()) {
      campaignMap.put(c.owner.id, c);
    };
    
    // Restore NFTs
    for ((id, nft) in stableNFTs.vals()) {
      nftMap.put(id, nft);
    };
    
    // Restore NFT counter
    nftNextId := stableNftNextId;
    
    // Clear stable variables to save memory
    stableUsers := [];
    stableCampaigns := [];
    stableNFTs := [];
  };

  // ICRC37 Standard Functions
  public query func icrc37_supported_standards() : async [(Text, Text)] {
    [
      ("ICRC-1", "https://github.com/dfinity/ICRC-1"),
      ("ICRC-3", "https://github.com/dfinity/ICRC-3"),
      ("ICRC-7", "https://github.com/dfinity/ICRC-7"),
      ("ICRC-30", "https://github.com/dfinity/ICRC-30"),
      ("ICRC-37", "https://github.com/dfinity/ICRC-37")
    ];
  };

  public query func icrc37_name() : async ?Text {
    icrc37_state.name;
  };

  public query func icrc37_symbol() : async ?Text {
    icrc37_state.symbol;
  };

  public query func icrc37_description() : async ?Text {
    icrc37_state.description;
  };

  public query func icrc37_logo() : async ?Text {
    icrc37_state.logo;
  };

  public query func icrc37_supply_cap() : async ?Nat {
    icrc37_state.supply_cap;
  };

  public query func icrc37_total_supply() : async Nat {
    nftMap.size();
  };

  // ICRC7 Functions
  public query func icrc7_tokens() : async [Nat] {
    get_icrc37_environment().icrc7.tokens();
  };

  public query func icrc7_owner_of(token_ids: [Nat]) : async [?Principal] {
    let env = get_icrc37_environment();
    Array.map(token_ids, func(id: Nat) : ?Principal {
      env.icrc7.owner_of(id);
    });
  };

  public query func icrc7_token_metadata(token_ids: [Nat]) : async [?[(Text, Text)]] {
    let env = get_icrc37_environment();
    Array.map(token_ids, func(id: Nat) : ?[(Text, Text)] {
      env.token_metadata(id);
    });
  };

  public query func icrc7_tokens_of(account: Principal) : async [Nat] {
    let env = get_icrc37_environment();
    env.tokens_of(account);
  };

  public shared(msg) func icrc7_transfer(args: [ICRC37Types.TransferArg]) : async [?ICRC37Types.TransferError] {
    let results = Array.init<?ICRC37Types.TransferError>(args.size(), null);
    
    for (i in Iter.range(0, args.size() - 1)) {
      let arg = args[i];
      
      // Check if caller owns all tokens
      for (id in arg.token_ids.vals()) {
        switch (nftMap.get(id)) {
          case null {
            results[i] := ?#NonExistentTokenId;
          };
          case (?nft) {
            if (nft.ownerId != msg.caller) {
              results[i] := ?#Unauthorized;
            } else {
              // Transfer the NFT
              let updatedNft = {
                id = nft.id;
                campaignId = nft.campaignId;
                ownerId = arg.to.owner;
                level = nft.level;
                metadata = nft.metadata;
              };
              nftMap.put(id, updatedNft);
            }
          }
        }
      }
    };
    
    Array.freeze(results);
  };

  // User Management Functions
  public shared(msg) func registerUser(username : Text) : async Result.Result<User.User, Text> {
    let caller = msg.caller;
    switch (UserService.registerUser(userMap, caller, username)) {
      case (#ok(user)) {
        #ok(user);
      };
      case (#err(error)) {
        #err(error);
      };
    };
  };

  public shared(msg) func getUserProfile() : async ?User.User {
    userMap.get(msg.caller);
  };

  public query func getUserByPrincipal(p : Principal) : async ?User.User {
    UserService.getUserByPrincipal(userMap, p);
  };

  public query func getUserProfileByUsername(username : Text) : async ?User.User {
    UserService.getUserByUsername(userMap, username);
  };

  // Campaign Management Functions
  public shared(msg) func addCampaign(c : Campaign.Campaign) : async Result.Result<Campaign.Campaign, Text> {
    CampaignService.addCampaign(campaignMap, msg.caller, c);
  };

  public shared(msg) func updateCampaign(c : Campaign.Campaign) : async Result.Result<Campaign.Campaign, Text> {
    CampaignService.updateCampaign(campaignMap, msg.caller, c);
  };

  public shared(msg) func deleteCampaign() : async Result.Result<Text, Text> {
    CampaignService.deleteCampaign(campaignMap, msg.caller);
  };

  public query func getAllCampaigns() : async [Campaign.Campaign] {
    CampaignService.getAllCampaign(campaignMap);
  };

  public shared(msg) func getDetailCampaign() : async ?Campaign.Campaign {
    campaignMap.get(msg.caller);
  };

  // NFT Management Functions
  public shared(msg) func mintNFT(
    campaignId: Nat,
    level: Text,
    metadata: NFT.Metadata
  ) : async Result.Result<NFT.NFT, Text> {
    // Check supply cap
    switch (icrc37_state.supply_cap) {
      case (?cap) {
        if (nftMap.size() >= cap) {
          return #err("Supply cap exceeded");
        };
      };
      case null {};
    };

    let (nft, nextId) = NFTService.mintNFT(nftMap, nftNextId, campaignId, msg.caller, level, metadata);
    nftNextId := nextId;
    #ok(nft);
  };

  public query func getNFTById(id: Nat): async ?NFT.NFT {
    NFTService.getNFTById(nftMap, id);
  };

  public query func getNFTsByUser(owner: Principal): async [NFT.NFT] {
    NFTService.getNFTsByOwner(nftMap, owner);
  };

  public query func getNFTsByCampaign(campaignId: Nat): async [NFT.NFT] {
    let nfts = Iter.toArray(nftMap.vals());
    Array.filter(nfts, func(nft: NFT.NFT) : Bool {
      nft.campaignId == campaignId;
    });
  };

  // Utility Functions
  public query func getStats() : async {
    totalUsers: Nat;
    totalCampaigns: Nat;
    totalNFTs: Nat;
  } {
    {
      totalUsers = userMap.size();
      totalCampaigns = campaignMap.size();
      totalNFTs = nftMap.size();
    };
  };
}