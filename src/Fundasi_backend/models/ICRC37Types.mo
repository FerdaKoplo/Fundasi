import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";

module {
  public type Account = {
    owner: Principal;
    subaccount: ?[Nat8];
  };

  public type TransferArg = {
    from: Account;
    to: Account;
    token_ids: [Nat];
    memo: ?Text;
    created_at_time: ?Nat;
  };

  public type TransferResult =
    { #Ok : [Nat] } or { #Err : Text };
}

