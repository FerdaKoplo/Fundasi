import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Int "mo:base/Int";
module {
    public type Users = HashMap.HashMap<Principal, User>;
    public type User = {
        id : Principal;
        username : Text;
        trustPoints : Nat;
        campaignCount : Nat;
        createdAt : Int;
        completedCampaigns : Nat;
        avatarUrl : ?Text;
    };
};