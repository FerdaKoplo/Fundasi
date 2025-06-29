import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";

module {
  public type Account = {
    owner: Principal;
    subaccount: ?[Nat8]; 
  };

  public type TransferArg = {
    from_subaccount: ?[Nat8]; 
    to: Account;              
    amount: Nat;              
    fee: ?Nat;                
    memo: ?Blob;              
    created_at_time: ?Nat64;  
  };

  public type TransferResult = {
    #Ok: Nat;    
    #Err: Text;   
  };
}
