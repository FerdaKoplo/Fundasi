import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useNFT } from "../../../hooks/useNFT";

// reward yang dikirim
type RewardFromLocation = {
  level: string;
  quantity: string | number;
  description: string;
  nftPrice: string | number;
};

// metadata NFT
type Metadata = {
  name: string;
  description: string;
  imageUrl: string;
  reward: string;
};

// struktur upload per level reward
type UploadEntry = {
  level: string;
  quantity: number;
  uploaded: (string | null)[];
  metadata: Omit<Metadata, "imageUrl">;
  nftPrice: string | number;
};

const NFTMinting = () => {
  const { id } = useParams<{ id: string }>();
  const campaignId = parseInt(id || "0");
  const location = useLocation();
  const navigate = useNavigate();
  const { mintRewardNFT } = useNFT();
  const rewards: RewardFromLocation[] = location.state?.rewards || [];

  const [uploads, setUploads] = useState<UploadEntry[]>(() =>
    rewards.map((reward) => ({
      level: reward.level,
      quantity: Number(reward.quantity),
      uploaded: Array(Number(reward.quantity)).fill(null),
      metadata: {
        name: reward.level,
        description: reward.description,
        reward: reward.level,
      },
      nftPrice: reward.nftPrice,
    }))
  );

  const handleImageUpload = (
    rewardIndex: number,
    imageIndex: number,
    file?: File
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploads((prev) => {
        const updated = [...prev];
        updated[rewardIndex].uploaded[imageIndex] = reader.result as string;
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleMint = async () => {
    try {
      for (const reward of uploads) {
        for (let i = 0; i < reward.uploaded.length; i++) {
          const imageUrl = reward.uploaded[i];
          if (!imageUrl) continue;

          await mintRewardNFT(
            campaignId,
            reward.level,
            {
              ...reward.metadata,
              imageUrl,
            },
            BigInt(reward.nftPrice || 0) // ← harga dari reward
          );
        }
      }
      alert("Minting complete!");
      navigate("/campaigns");
    } catch (error) {
      console.error("Minting error:", error);
      alert("Minting failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6 text-center">NFT Minting</h1>

      {uploads.map((reward, rewardIndex) => (
        <div key={rewardIndex} className="mb-10">
          <h2 className="text-xl font-semibold mb-2">
            Level: {reward.level} ({reward.quantity} NFTs)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reward.uploaded.map((img, imgIndex) => (
              <div
                key={imgIndex}
                className="border border-gray-700 p-2 rounded-lg"
              >
                {img ? (
                  <img src={img} alt={`NFT ${imgIndex}`} className="w-full" />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(
                        rewardIndex,
                        imgIndex,
                        e.target.files?.[0]
                      )
                    }
                    className="w-full text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          className="mt-6 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold"
          onClick={handleMint}
        >
          Mint All NFTs
        </button>
      </div>
    </div>
  );
};

export default NFTMinting;
