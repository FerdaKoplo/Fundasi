import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Hash "mo:base/Hash";
import UserService "services/UserService";
import CampaignService "services/CampaignService";
import NFTService "services/NFTService";
import User "models/User";
import Campaign "models/Campaign";

actor Main {
  
  stable var stableUser: [User.User] = [] : [User.User];
  var userMap : HashMap.HashMap<Principal, User.User> = HashMap.HashMap(0, Principal.equal, Principal.hash);

  stable var stableCampaigns : [Campaign.Campaign] = [] : [Campaign.Campaign];
  var campaignMap : HashMap.HashMap<Nat, Campaign.Campaign> = HashMap.HashMap<Nat, Campaign.Campaign>(0, Nat.equal, Hash.hash);

  var campaignCounter : Nat = 0;

  for (user in stableUser.vals()) {
    userMap.put(user.id, user);
  };
  
  system func preupgrade() {
    stableUser := Iter.toArray(userMap.vals());
    stableCampaigns := Iter.toArray(campaignMap.vals());
  };
  
  system func postupgrade() {
    for (user in stableUser.vals()) {
      userMap.put(user.id, user);
    };
    for (campaign in stableCampaigns.vals()) {
      campaignMap.put(campaign.id, campaign);
    };
    stableUser := [];
    stableCampaigns := [];
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
};
