import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
module {
    public type Users = HashMap.HashMap<Principal, User>;
    public type User = {
        id : Principal;
        username : Text
    };
};