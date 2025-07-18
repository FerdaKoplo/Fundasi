import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth-context";
import { useCampaign } from "../../hooks/useCampaign";
import { Principal } from "@dfinity/principal";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { Campaign } from "../../../../declarations/Fundasi_backend/Fundasi_backend.did";

interface UserCampaignProps {
  isEditMode?: boolean;
  onCampaignSelect?: (campaign: Campaign | null) => void;
}

const UserCampaign: React.FC<UserCampaignProps> = ({
  isEditMode = false,
  onCampaignSelect,
}) => {
  const { user, isLoading, principalId } = useAuth();
  const { campaigns, loading, error, fetchCampaignByOwner } = useCampaign();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  useEffect(() => {
    if (principalId) {
      fetchCampaignByOwner(Principal.fromText(principalId));
    }
  }, [principalId, fetchCampaignByOwner]);

  const handleSelect = (campaign: Campaign) => {
    if (!isEditMode) return;

    const isSame = selectedCampaign?.id === campaign.id;
    const newSelection = isSame ? null : campaign;

    setSelectedCampaign(newSelection);
    onCampaignSelect?.(newSelection);
  };

  return (
    <div>
      {loading && campaigns.length === 0 && <div>Loading campaigns...</div>}
      {!loading && campaigns.length === 0 && <div>No campaigns found</div>}

      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {campaigns.map((biz, index) => {
            const isSelected = selectedCampaign?.id === biz.id;

            return (
              <div
                key={index}
                className={`bg-zinc-900 rounded-lg overflow-visible relative cursor-pointer ${
                  isEditMode && isSelected ? "ring-2 ring-green-500" : ""
                }`}
                onClick={() => handleSelect(biz)}
              >
                {isEditMode && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    className="absolute top-2 right-2 w-5 h-5 z-10"
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelect(biz);
                    }}
                  />
                )}
                <div className="relative">
                  {biz.media.imageUrl.length > 0 && (
                    <img
                      src={biz.media.imageUrl[0]}
                      alt={biz.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="absolute -top-5 -left-3 w-12 h-12 rounded-full p-1 bg-gradient-to-r from-[#398267] to-[#A5CC86]">
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-black text-white font-bold text-sm">
                      {Number(biz.stats.upvote * biz.stats.devote)}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <h2 className="text-white font-semibold text-base">
                        {biz.title}
                      </h2>
                      <p className="text-sm text-gray-400 mb-2">
                        {biz.owner.username}
                      </p>
                    </div>
                    <Link to={`/campaign/${biz.id}`}>
                      <FaEye />
                    </Link>
                  </div>
                  <div className="flex items-center text-sm text-white gap-2">
                    <span className="font-bold">
                      {biz.rewards.length} rewards available
                    </span>
                    <span className="text-white/60">
                      • Ends on:{" "}
                      {new Date(
                        Number(biz.endTime) / 1_000_000
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserCampaign;
