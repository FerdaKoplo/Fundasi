import React, { useState } from "react";

interface RewardProps {
  rewards: {
    level: number;
    title: string;
    description: string;
    imageUrl: string[];
    quantity: number;
    items: string[];
  }[];
}

const Reward: React.FC<RewardProps> = ({ rewards }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = rewards[selectedIndex];

  return (
    <div className="flex gap-10 mt-10">
      {/* Sidebar kiri */}
      <div className="w-1/6 space-y-4">
        {rewards.map((r, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`cursor-pointer p-3 rounded-lg border ${
              index === selectedIndex
                ? "border-green-500 bg-gray-800"
                : "border-gray-600"
            }`}
          >
            <p className="text-sm">Level {r.level}</p>
            <p className="text-xs text-green-500">1 NFT - {r.title}</p>
          </div>
        ))}
      </div>

      {/* NFT Card tengah */}
      <div className="w-2/6">
        <div className="bg-gray-900 p-6 rounded-lg text-center space-y-4 w-full max-w-xs">
          {selected.imageUrl[0] && (
            <img
              src={selected.imageUrl[0]}
              alt={selected.title}
              className="w-20 h-20 object-cover mx-auto"
            />
          )}
          <h3 className="text-lg font-bold">Level {selected.level}</h3>
          <p className="text-green-500 font-semibold">1 NFT</p>
          <p className="text-sm">{selected.title}</p>
          <p className="text-xs text-gray-400">Ships Worldwide</p>
          <button className="mt-4 w-full py-2 rounded-full bg-green-600 hover:bg-green-700">
            Fund 1 NFT
          </button>
        </div>
      </div>

      {/* Deskripsi kanan */}
      <div className="w-3/6 space-y-4">
        <h2 className="text-2xl font-bold">Description</h2>
        <p>{selected.description}</p>
        <p className="text-sm text-gray-400">
          Quantity Available: {selected.quantity}
        </p>
        <h3 className="font-semibold">Item Included</h3>
        <ul className="list-disc list-inside">
          {selected.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reward;
