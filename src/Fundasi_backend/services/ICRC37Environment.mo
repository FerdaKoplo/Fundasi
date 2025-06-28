import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import NFTService "../services/NFTService";
import NFT "../models/NFT";
import ICRC37Types "../models/ICRC37Types";
import Debug "mo:base/Debug";

module {

  public func getEnv(
    canisterId: Principal,
    nftMap: HashMap.HashMap<Nat, NFT.NFT>,
    collectionState: ICRC37Types.CollectionState
  ) : ICRC37Types.Environment {
    {
      canister = canisterId; 
      get_time = Time.now;

      refresh_state = func() : ICRC37Types.CollectionState {
        collectionState;
      };

      icrc7 = {
        tokens = func () : [Nat] {
          NFTService.tokens(nftMap);
        };

        owner_of = func (tokenId: Nat) : ?Principal {
          NFTService.ownerOf(nftMap, tokenId);
        };

        transfer_from = ?(
          func (caller: Principal, arg: ICRC37Types.TransferArg): ICRC37Types.TransferResult {
            Debug.print("📥 transfer_from called with caller = " # Principal.toText(caller));
            Debug.print("📥 transfer_from from.owner = " # Principal.toText(arg.from.owner));
            
            // Jangan validasi auth di sini, karena sudah divalidasi sebelumnya di ICRC37.transfer()
            switch (NFTService.transferNFT(nftMap, arg)) {
              case (#ok(tokenIds)) #Ok(tokenIds);
              case (#err(msg)) #Err(msg);
            };
          }
        );
      };

      token_metadata = func(tokenId: Nat) : ?[(Text, Text)] {
        NFTService.getMetadataFor(nftMap, tokenId);
      };

      tokens_of = func(owner: Principal) : [Nat] {
        NFTService.tokensOf(nftMap, owner);
      };

      can_approve_token = null;
      can_approve_collection = null;
      can_revoke_token_approval = null;
      can_revoke_collection_approval = null;

      add_ledger_transaction = func(_msg: Text) {};
    }
  };
  
   public func defaultConfig(): () {
    ();
  };
};