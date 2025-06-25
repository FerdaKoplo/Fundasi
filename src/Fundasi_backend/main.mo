import User "models/User";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Hash "mo:base/Hash";
import UserService "services/UserService";
import CampaignService "services/CampaignService";
import Nat "mo:base/Nat";
import Campaign "models/Campaign";
import Review "models/Review";
import ReviewService "services/ReviewService";

actor Main {
  
  stable var stableUser: [User.User] = [] : [User.User];
  var userMap : HashMap.HashMap<Principal, User.User> = HashMap.HashMap(0, Principal.equal, Principal.hash);

  stable var stableCampaigns : [Campaign.Campaign] = [] : [Campaign.Campaign];
  var campaignMap : HashMap.HashMap<Nat, Campaign.Campaign> = HashMap.HashMap<Nat, Campaign.Campaign>(0, Nat.equal, Hash.hash);

  stable var stableReviews : [Review.Review] = [] : [Review.Review];
  var reviewsMap : HashMap.HashMap<Principal, Review.Review> = HashMap.HashMap(0, Principal.equal, Principal.hash);

  // stable var stableNFTs : [(Nat, NFT.NFT)] = [];
  // var nftMap : HashMap.HashMap<Nat, NFT.NFT> = HashMap.HashMap<Nat, NFT.NFT>(0, Nat.equal, Nat.hash);
  // var nextNftId : Nat = 0;

  var campaignCounter : Nat = 0;
  // stable var icrc37_state = ICRC37.init(ICRC37.initialState(), #v0_1_0(#id), Icrc37Environment.defaultConfig(), Principal.fromActor(Main));
  // private var _icrc37: ?ICRC37.ICRC37 = null;

  // private func get_icrc37_environment(): Icrc37Types.Environment {
  //   Icrc37Environment.getEnvironment(nftMap, icrc37_state);
  // };

  // private func icrc37(): ICRC37.ICRC37 {
  //   switch (_icrc37) {
  //     case (null) {
  //       let instance = ICRC37.ICRC37(?icrc37_state, Principal.fromActor(Main), get_icrc37_environment());
  //       _icrc37 := ?instance;
  //       instance;
  //     };
  //     case (?val) val;
  //   }
  // };

  // for (user in stableUser.vals()) {
  //   userMap.put(user.id, user);
  // };
  
  // system func preupgrade() {
  //   stableUser := Iter.toArray(userMap.vals());
  //   stableCampaigns := Iter.toArray(campaignMap.vals());
  //   stableNFTs := Iter.toArray(nftMap.entries());
  // };
  
  // system func postupgrade() {
  //   for (user in stableUser.vals()) {
  //     userMap.put(user.id, user);
  //   };
  //   for (campaign in stableCampaigns.vals()) {
  //     campaignMap.put(campaign.id, campaign);
  //   };
  //   for ((id, nft) in stableNFTs.vals()) {
  //     nftMap.put(id, nft);
  //   };
  //   stableUser := [];
  //   stableCampaigns := [];
  //   stableNFTs := [];
  // };
  
  // // NFT
  // public shared(msg) func mintRewardNFT(campaignId: Nat, level: Text, metadata: NFT.Metadata): async NFT.NFT {
  //   let caller = msg.caller;
  //   let (nft, nextId) = NFTService.mintNFT(nftMap, nextNftId, campaignId, caller, level, metadata);
  //   nextNftId := nextId;
  //   return nft;
  // };

  // public shared(msg) func transfer(arg: Icrc37Types.TransferArg): async Icrc37Types.TransferResult {
  //   icrc37().transfer(msg.caller, arg);
  // };

  // // ICRC-7/ICRC-37 Queries
  // public query func icrc37_supported_standards(): async [(Text, Text)] {
  //   icrc37().supported_standards();
  // };

  // public query func icrc37_name(): async ?Text {
  //   icrc37().name();
  // };

  // public query func icrc37_symbol(): async ?Text {
  //   icrc37().symbol();
  // };

  // public query func icrc37_description(): async ?Text {
  //   icrc37().description();
  // };

  // public query func icrc37_logo(): async ?Text {
  //   icrc37().logo();
  // };

  // public query func icrc37_supply_cap(): async ?Nat {
  //   icrc37().supply_cap();
  // };

  // public query func icrc37_total_supply(): async Nat {
  //   icrc37().total_supply();
  // };

  // public query func icrc7_tokens(): async [Nat] {
  //   icrc37().tokens();
  // };

  // public query func icrc7_owner_of(ids: [Nat]): async [?Principal] {
  //   icrc37().owner_of(ids);
  // };

  // public query func icrc7_token_metadata(ids: [Nat]): async [?[(Text, Text)]] {
  //   icrc37().token_metadata(ids);
  // };

  // public query func icrc7_tokens_of(owner: Principal): async [Nat] {
  //   icrc37().tokens_of(owner);
  // };


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

  // User Trust Points
  public shared(_) func upvoteUser(userId : Principal, points : Nat) : async Result.Result<User.User, Text> {
      let result = UserService.postUpvote(userMap, userId, points);
      switch (result) {
          case (?updatedUser) {
              userMap.put(userId, updatedUser);
              stableUser := Array.filter<User.User>(stableUser, func(u) { u.id != userId });
              stableUser := Array.append(stableUser, [updatedUser]);
              return #ok(updatedUser);
          };
          case (null) {
              return #err("User not found");
          };
      };
  };
  
  public shared(_) func devoteUser(userId : Principal, points : Nat) : async Result.Result<User.User, Text> {
      let result = UserService.postDevote(userMap, userId, points);
      switch (result) {
          case (?updatedUser) {
              userMap.put(userId, updatedUser);
              stableUser := Array.filter<User.User>(stableUser, func(u) { u.id != userId });
              stableUser := Array.append(stableUser, [updatedUser]);
              return #ok(updatedUser);
          };
          case (null) {
              return #err("User not found");
          };
      };
  };

  // Review

  public shared(msg) func postReview(comment : Text) : async Result.Result<Review.Review, Text> {
    let caller = msg.caller;

    switch (reviewsMap.get(caller)) {
        case (?existingReview) {
            return #err("You have already submitted a review.");
        };
        case (null) {
            switch (userMap.get(caller)) {
                case (?user) {
                    let result = ReviewService.postReview(caller, user, comment);
                    switch (result) {
                        case (#ok(newReview)) {
                            reviewsMap.put(caller, newReview);
                            stableReviews := Array.append(stableReviews, [newReview]);
                            return #ok(newReview);
                        };
                        case (#err(error)) {
                            return #err(error);
                        };
                    };
                };
                case (null) {
                    return #err("User not found.");
                };
            };
        };
      };
    };

  public query func getAllReviews() : async [Review.Review] {
    return ReviewService.getAllReviews(reviewsMap);
  };
};
