import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import User "User";
module {
    public type Campaigns = HashMap.HashMap<Principal, Campaign>;
    public type Campaign = {
        id : Text;
        description : Text;
        title : Text;
        milestone : Nat;
        owner: User.User;
        stats : CampaignStats;
        media : CampaignMedia;
        rewards : [Rewards]
    };

    public type CampaignStats = {
        upvote : Nat;
        devote : Nat;
    };

    // public type Author = {
    //     id: Principal;
    //     username: Text;
    //     trustPoints: Nat;
    //     campaignCount: Nat;
    //     createdAt: Nat;  
    //     completedCampaigns: Nat;
    //     avatarUrl: ?Text;
    // };

    public type CampaignMedia = {
        imageUrl : Text
    };

    public type Rewards =  {
        level : Text;
        imageUrl : Text;
        quantity : Nat;
        estimatedDelivery : Text;
    }
};