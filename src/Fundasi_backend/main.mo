import User "models/User";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import UserService "services/UserService";
actor Main {
  
  stable var stableUser: [User.User] = [] : [User.User];
  var userMap : HashMap.HashMap<Principal, User.User> = HashMap.HashMap(0, Principal.equal, Principal.hash);

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
};
