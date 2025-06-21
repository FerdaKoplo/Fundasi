import User "../models/User";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import UserRepository "../repository/UserRepository";
module {

      public func registerUser(users : User.Users, userId : Principal, username : Text) : Result.Result<User.User, Text> {
        if (Text.size(username) < 3) {
            return #err("Username must be at least 3 characters long");
        };
        if (Principal.isAnonymous(userId)) {
            return #err("Invalid principal");
        };
        for ((id, user) in users.entries()) {
            if (Text.equal(user.username, username) and id != userId) {
                return #err("USERNAME_TAKEN: The username '" # username # "' is already in use.");
            };
        };
        switch (users.get(userId)) {
            case (?existingUser) {
                #ok(existingUser);
            };
            case (null) {
                let newUser : User.User = {
                    id = userId;
                    username = username;
                    trustPoints = 0;
                    campaignCount = 0;
                    createdAt = Time.now();
                    completedCampaigns = 0;
                    avatarUrl = null;
                };
                users.put(userId, newUser);
                
                #ok(newUser);
            };
        };
    };
    
    public func getCurrentUser(users: [User.User], caller:Principal) : ?User.User {
        return UserRepository.getUser(users, caller);
    };

    public func getUserByUsername(users : User.Users, username : Text) : ?User.User {
        for ((principal, user) in users.entries()) {
            if (user.username == username) {
                return ?user;
            };
        };
        return null;
    };
};