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

  public type TransferError = {
    #GenericError: { message: Text; error_code: Nat };
    #TemporarilyUnavailable;
    #InsufficientFunds: { balance: Nat };
    #BadBurn: { min_burn_amount: Nat };
    #Duplicate: { duplicate_of: Nat };
  #BadFee: { expected_fee: Nat };
    #CreatedInFuture: { ledger_time: Nat64 };
    #TooOld;
    #InsufficientAllowance: { allowance: Nat };
  };

  public type TransferResult = {
    #Ok: Nat;    
    #Err: TransferError;   
  };
}
