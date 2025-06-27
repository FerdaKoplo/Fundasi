import NFT "../models/NFT";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Result "mo:base/Result";
import ICRC37Types "../models/ICRC37Types";

module {
  // Mint NFT baru
  public func mintNFT(
    nfts: HashMap.HashMap<Nat, NFT.NFT>,
    nextId: Nat,
    campaignId: Nat,
    ownerId: Principal,
    level: Text,
    metadata: NFT.Metadata,
    price: Nat
  ) : (NFT.NFT, Nat) {
    let nft: NFT.NFT = {
      id = nextId;
      campaignId = campaignId;
      ownerId = ownerId;
      level = level;
      metadata = metadata;
      price = price;
      isAvailable = true;
    };
    nfts.put(nextId, nft);
    (nft, nextId + 1);
  };

  public func transferNFT(
    nfts: HashMap.HashMap<Nat, NFT.NFT>,
    arg: ICRC37Types.TransferArg
  ) : Result.Result<[Nat], Text> = do {
    if (arg.token_ids.size() == 0) {
      return #err("No token ID specified");
    };

    let tokenId = arg.token_ids[0];

    switch (nfts.get(tokenId)) {
      case null {
        return #err("Token not found");
      };
      case (?nft) {
        if (nft.ownerId != arg.from.owner) {
          return #err("Caller is not the owner of this NFT");
        };

        let updatedNft = {
          nft with
          ownerId = arg.to.owner;
          isAvailable = false;
        };

        nfts.put(tokenId, updatedNft);
        return #ok([tokenId]);
      };
    };
  };

  public func getNFTsByOwner(
    nfts: HashMap.HashMap<Nat, NFT.NFT>,
    ownerId: Principal
    ) : [NFT.NFT] {
    Array.filter<NFT.NFT>(
        Iter.toArray(nfts.vals()),
        func(nft: NFT.NFT) {
        nft.ownerId == ownerId
        }
    );
    };
  public func getAllNFTs(
    nfts: HashMap.HashMap<Nat, NFT.NFT>
  ) : [NFT.NFT] {
    Iter.toArray(nfts.vals());
  };

  public func getNFTById(
    nfts: HashMap.HashMap<Nat, NFT.NFT>,
    id: Nat
  ) : ?NFT.NFT {
    nfts.get(id);
  };

  public func tokensOf(
    nfts: HashMap.HashMap<Nat, NFT.NFT>,
    ownerId: Principal
    ) : [Nat] {
    Array.mapFilter<NFT.NFT, Nat>(
        Iter.toArray(nfts.vals()),
        func(nft: NFT.NFT) {
        if (nft.ownerId == ownerId) {
            ?nft.id
        } else {
            null
        }
        }
    );
    };

    public func ownerOf(
      nfts: HashMap.HashMap<Nat, NFT.NFT>,
      tokenId: Nat
    ) : ?Principal {
      switch (nfts.get(tokenId)) {
        case (?nft) ?nft.ownerId;
        case null null;
      }
    };

    public func tokens(
      nfts: HashMap.HashMap<Nat, NFT.NFT>
    ) : [Nat] {
      Iter.toArray(nfts.keys());
    };

  public func getMetadataFor(
    nfts: HashMap.HashMap<Nat, NFT.NFT>,
    id: Nat
    ) : ?[(Text, Text)] {
    switch (nfts.get(id)) {
        case null {
        null;
        };
        case (?nft) {
        ?[
            ("name", nft.metadata.name),
            ("description", nft.metadata.description),
            ("image", nft.metadata.imageUrl),
            ("reward", nft.metadata.reward),
            ("level", nft.level),
            ("price", Nat.toText(nft.price)),
        ];
        };
    };
    };

}
