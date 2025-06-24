import User "models/User";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import UserService "services/UserService";
import Campaign "models/Campaign";
import CampaignService "services/CampaignService";

actor Main {
  
     stable var stableUser: [User.User] = [] : [User.User];
     var userMap : HashMap.HashMap<Principal, User.User> = HashMap.HashMap(0, Principal.equal, Principal.hash);

     stable var stableCampaigns : [Campaign.Campaign] = [] : [Campaign.Campaign];
     var campaignMap : HashMap.HashMap<Principal, Campaign.Campaign> = HashMap.HashMap(0, Principal.equal, Principal.hash);

     for (user in stableUser.vals()) {
       userMap.put(user.id, user);
     };

     system func preupgrade() {
        stableUser := Iter.toArray(userMap.vals());
     };

     system func postupgrade() {
       for (user in stableUser.vals()) {
           userMap.put(user.id, user);
         };
         stableUser := [];
       };

      public shared(msg) func registerUser(username : Text) : async Result.Result<User.User, Text> {
       let caller = msg.caller;

       let result = UserService.registerUser(userMap, caller, username);
       switch result {
         case (#ok(newUser)) {
           // simpan ke stable
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
     public shared(msg) func addCampaign(newCampaign : Campaign.Campaign) : async Result.Result<Campaign.Campaign, Text> {
         CampaignService.addCampaign(campaignMap, msg.caller, newCampaign);
     };
     public shared(msg) func updateCampaign(updatedCampaign : Campaign.Campaign) : async Result.Result<Campaign.Campaign, Text> {
         CampaignService.updateCampaign(campaignMap, msg.caller, updatedCampaign);
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
  

  public query func getUserByPrincipal(p : Principal) : async ?User.User {
    return UserService.getUserByPrincipal(userMap, p);
  };
};
