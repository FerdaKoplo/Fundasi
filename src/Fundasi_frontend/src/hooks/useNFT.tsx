import { Fundasi_backend } from "../../../declarations/Fundasi_backend";
import { Principal } from "@dfinity/principal";

export const useNFT = () => {
  const mintRewardNFT = async (
    campaignId: number,
    level: string,
    metadata: {
      name: string;
      description: string;
      imageUrl: string;
      reward: string;
    },
    price: bigint
  ) => {
    try {
      const nft = await Fundasi_backend.mintRewardNFT(
        BigInt(campaignId),
        level,
        metadata,
        price
      );
      return nft;
    } catch (err) {
      console.error("Minting failed:", err);
      throw err;
    }
  };

  return { mintRewardNFT };
};
