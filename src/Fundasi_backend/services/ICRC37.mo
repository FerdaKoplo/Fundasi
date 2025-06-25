import ICRC37Types "../models/ICRC37Types";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module ICRC37 {
  public type State = ICRC37Types.CollectionState;
  public type Environment = ICRC37Types.Environment;
  public type TransferArg = ICRC37Types.TransferArg;
  public type TransferResult = ICRC37Types.TransferResult;
  public type TransferError = ICRC37Types.TransferError;

  public class ICRC37(
    initState: ?State,
    deployer: Principal,
    env: Environment
  ) {
    private let state: State = switch initState {
      case (?s) s;
      case null {
        {
          logo = null;
          name = null;
          symbol = null;
          description = null;
          supply_cap = null;
          deployer = deployer;
          royalties = null;
          custodians = [deployer];
          allow_transfers = ?true;
        }
      }
    };

    public func name() : ?Text = state.name;
    public func symbol() : ?Text = state.symbol;
    public func description() : ?Text = state.description;
    public func logo() : ?Text = state.logo;
    public func supply_cap() : ?Nat = state.supply_cap;
    public func total_supply() : Nat = env.icrc7.tokens().size();

    public func tokens() : [Nat] = env.icrc7.tokens();

    public func owner_of(token_id: Nat) : ?Principal = env.icrc7.owner_of(token_id);

    public func token_metadata(token_id: Nat) : ?[(Text, Text)] = env.token_metadata(token_id);

    public func tokens_of(owner: Principal) : [Nat] = env.tokens_of(owner);

    public func transfer(caller: Principal, arg: TransferArg) : TransferResult {
      if (arg.from.owner != caller) {
        return #Err("Unauthorized");
      };

      switch (env.icrc7.transfer_from) {
        case (null) return #Err("Transfer not supported");
        case (?transferFunc) return transferFunc(caller, arg);
      }
    };
  };

  public func initialState() : State {
    {
      logo = null;
      name = null;
      symbol = null;
      description = null;
      supply_cap = null;
      deployer = Principal.fromText("aaaaa-aa"); // default placeholder
      royalties = null;
      custodians = [];
      allow_transfers = ?true;
    }
  };

  public func init(
    existing: State,
    _version: { #v0_1_0: { #id; } },
    _config: (),
    caller: Principal
  ) : State {
    {
      logo = existing.logo;
      name = existing.name;
      symbol = existing.symbol;
      description = existing.description;
      supply_cap = existing.supply_cap;
      deployer = caller;
      royalties = existing.royalties;
      custodians = [caller];
      allow_transfers = existing.allow_transfers;
    }
  };
} 
