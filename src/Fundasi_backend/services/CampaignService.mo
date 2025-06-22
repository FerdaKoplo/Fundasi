import Campaign "../models/Campaign";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
module {

    public func getAllCampaign(campaigns : Campaign.Campaigns) : [Campaign.Campaign] {
        Iter.toArray(campaigns.vals());
    };

    public func getDetailCampaign(campaign : Campaign.Campaigns, ownerId : Principal) : ?Campaign.Campaign {
        campaign.get(ownerId);
    };

    public func addCampaign(campaigns : Campaign.Campaigns, ownerId : Principal, newCampaign : Campaign.Campaign) : Result.Result<Campaign.Campaign, Text> {
        if (campaigns.get(ownerId) != null) {
            return #err("Owner already has a campaign registered.");
        };
        campaigns.put(ownerId, newCampaign);
        #ok(newCampaign);
    };

    public func updateCampaign(campaigns : Campaign.Campaigns, ownerId : Principal, updatedCampaign  : Campaign.Campaign) : Result.Result<Campaign.Campaign, Text> {
        switch (campaigns.get(ownerId)) {
        case (?_) {
            campaigns.put(ownerId, updatedCampaign);
            #ok(updatedCampaign);
        };
        case (null) {
            #err("Campaign for this owner not found, cannot update.");
        };
    };
  };

  public func deleteCampaign( campaigns : Campaign.Campaigns, ownerId : Principal) : Result.Result<Text, Text> {
    switch (campaigns.get(ownerId)) {
        case (?_) {
            let _ = campaigns.remove(ownerId);
            #ok("Campaign deleted successfully.");
        };
        case (null) {
            #err("Campaign for this owner not found, cannot delete.");
        };
    };
};
};