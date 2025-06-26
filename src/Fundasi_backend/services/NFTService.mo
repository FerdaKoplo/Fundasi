import NFT "../models/NFT";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";

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
    };
    nfts.put(nextId, nft);
    (nft, nextId + 1);
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
