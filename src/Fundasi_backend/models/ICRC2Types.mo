import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";


module {
    public type TransferFromError = {
        #GenericError: {message : Text; error_code : Nat};
        #TemporarilyUnavailable;
        #InsufficientAllowance : { allowance : Nat };
        #BadBurn :  { min_burn_amount : Nat };
        #Duplicate : { duplicate_of : Nat };
      #BadFee : { expected_fee : Nat };
        #CreatedInFuture :  { ledger_time : Nat64 };
        #TooOld;
        #InsufficientFunds :  { balance : Nat };
    };
    public type TransferFromResult = {
        #Ok: Nat;
        #Err: TransferFromError;
    };
}