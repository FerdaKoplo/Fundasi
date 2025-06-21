import User "../models/User";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Bool "mo:base/Bool";
module {
    public func getUser(users: [User.User], id:Principal ) : ?User.User {
        return Array.find<User.User>(users, func(user: User.User) : Bool{
            user.id == id
        })
    };
};