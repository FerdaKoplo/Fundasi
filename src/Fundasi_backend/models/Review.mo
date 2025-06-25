import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Int "mo:base/Int";
import User "User";
module {
    public type Reviews = HashMap.HashMap<Principal, Review>;
    public type Review = {
        id : Text;
        user : User.User;
        comment : Text;
    };
};