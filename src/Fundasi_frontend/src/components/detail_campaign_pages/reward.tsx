import React from "react";

interface RewardProps {
  rewards: {
    level: string;
    imageUrl: string;
    quantity: bigint;
    description: string;
    estimatedDelivery: [] | [string];
    nftPrice: bigint;
  }[];
  selectedIndex: number;
}

export const Reward: React.FC<RewardProps> = ({ rewards, selectedIndex }) => {
  const selected = rewards[selectedIndex];

  return (
    <div className="flex flex-col md:flex-row gap-10 text-white">
      {/* Kartu NFT */}
      <div className="md:w-1/2 bg-zinc-900 p-6 rounded-xl space-y-5 max-w-sm shadow-lg">
        <div className="w-full h-40 bg-zinc-800 flex items-center justify-center rounded-md">
          {selected.imageUrl ? (
            <img
              src={selected.imageUrl}
              alt={`Level ${selected.level}`}
              className="h-full object-contain"
            />
          ) : (
            <div className="text-gray-500 text-sm">No Image</div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Level {selected.level}</h3>
          <span className="text-green-400 font-semibold">
            {selected.nftPrice.toString()} NFT
          </span>
        </div>

        <p className="text-sm">{selected.description}</p>

        <div className="flex justify-between text-sm text-gray-400">
          <span>Estimated Delivery</span>
          <span>{selected.estimatedDelivery || "-"}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Ships To</span>
          <span>Ships Worldwide</span>
        </div>

        <button className="w-full py-2 rounded-full black-gradient hover:scale-105 active:scale-95 transition-transform duration-200">
          Fund {selected.nftPrice.toString()} NFT
        </button>
      </div>

      {/* Deskripsi */}
      <div className="md:w-1/2 space-y-5">
        <h2 className="text-2xl font-bold">Description</h2>
        <p className="text-gray-300">{selected.description}</p>

        <p className="text-sm text-gray-400">
          Quantity Available: {selected.quantity.toString()}
        </p>

        <div>
          <h3 className="font-semibold mb-2">1 Item included</h3>
          <div className="bg-zinc-800 p-4 rounded-md">
            <p className="text-white font-medium">Photo Card</p>
            <p className="text-sm text-gray-400">Quantity: 1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reward;