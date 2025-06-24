import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import User "User";
import Review "Review";
module {
    public type Campaigns = HashMap.HashMap<Principal, Campaign>;
    public type Campaign = {
        description : Text;
        title : Text;
        milestone : Nat;
        owner: User.User;
        stats : CampaignStats;
        media : CampaignMedia;
        rewards : [Rewards];
        about : [AboutCampaign];
        review : ?Review.Review
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
        imageUrl : ?Text
    };

    public type Rewards =  {
        level : Text;
        imageUrl : ?Text;
        quantity : Nat;
        description : Text;
        estimatedDelivery : ?Text;
    };

    public type AboutCampaign = {
        titleAbout : ?Text;
        content : ?Text;
        section : ?Text
    }

};