
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";

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

  public type TransferResult = {
    #Ok: [Nat];
    #Err: Text;
  };

  public type TransferError = {
    #NonExistentTokenId;
    #Unauthorized;
    #Rejected;
    #InvalidRecipient;
    #TemporarilyUnavailable;
    #Other: Text;
  };

  public type CollectionState = {
    logo: ?Text;
    name: ?Text;
    symbol: ?Text;
    description: ?Text;
    supply_cap: ?Nat;
    deployer: Principal;
    royalties: ?Nat;
    custodians: [Principal];
    allow_transfers: ?Bool;
  };

  public type Environment = {
    canister: Principal;
    get_time: () -> Int;
    refresh_state: () -> CollectionState;

    icrc7: {
      tokens: () -> [Nat];
      owner_of: (Nat) -> ?Principal;
      transfer_from: ?((Principal, TransferArg) -> TransferResult);
    };

    token_metadata: (Nat) -> ?[(Text, Text)];
    tokens_of: (Principal) -> [Nat];

    can_approve_token: ?((Principal, Nat) -> Bool);
    can_approve_collection: ?((Principal) -> Bool);
    can_revoke_token_approval: ?((Principal, Nat) -> Bool);
    can_revoke_collection_approval: ?((Principal) -> Bool);

    add_ledger_transaction: (Text) -> ();
  };
}
