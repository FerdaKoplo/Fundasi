import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
  public type Metadata = {
    name: Text;           
    description: Text;    
    imageUrl: Text;       
    reward: Text;         
  };

  public type NFT = {
    id: Nat;        
    campaignId: Nat;      
    ownerId: Principal;   
    level: Text;          
    metadata: Metadata;   
  };
}
