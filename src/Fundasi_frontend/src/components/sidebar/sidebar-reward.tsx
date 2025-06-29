import React from "react";
import { FaChevronRight } from "react-icons/fa";

interface SidebarRewardProps {
  rewards: {
    level: string;
    quantity: bigint;
    description: string;
    nftPrice: bigint;
  }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const SidebarReward: React.FC<SidebarRewardProps> = ({
  rewards,
  selectedIndex,
  onSelect,
}) => {
  return (
    <nav className="space-y-3">
      {rewards.map((reward, index) => (
        <div
          key={index}
          onClick={() => onSelect(index)}
          className={`p-3 cursor-pointer rounded-lg transition ${
            selectedIndex === index
              ? "bg-gray-900 border border-green-500"
              : "hover:bg-gray-800"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">Level {reward.level}</p>
              <p className="text-sm text-green-200">
                {reward.nftPrice.toString()} NFT - {reward.description}
              </p>
            </div>
            {selectedIndex === index && (
              <FaChevronRight className="text-green-400" />
            )}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default SidebarReward;
