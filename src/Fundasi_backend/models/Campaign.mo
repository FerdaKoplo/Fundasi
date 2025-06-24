import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import User "User";
import Review "Review";
module {
    public type Campaigns = HashMap.HashMap<Nat, Campaign>;
    public type Campaign = {
        id : Nat;
        description : Text;
        title : Text;
        milestone : Nat;
        owner: User.User;
        stats : CampaignStats;
        media : CampaignMedia;
        rewards : [Rewards];
        about : [AboutCampaign];
        review : ?Review.Review;
        endTime : Int
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
        imageUrl : [Text]
    };

    public type Rewards =  {
        level : Text;
        imageUrl : ?Text;
        quantity : Nat;
        description : Text;
        estimatedDelivery : ?Text;
        nftPrice : Nat;
    };

    public type AboutCampaign = {
        titleAbout : ?Text;
        imageUrl : [Text];
        content : ?Text;
        section : ?Text
    }

};