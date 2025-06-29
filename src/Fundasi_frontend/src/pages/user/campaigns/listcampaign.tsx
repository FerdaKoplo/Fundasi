import { useEffect, useState } from "react";
import { useCampaign } from "../../../hooks/useCampaign";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../../../components/nav/campaign/nav-menu";

export default function MicroBusinessList() {
  const [search, setSearch] = useState("");
  const { fetchAllCampaing, campaigns, loading, error } = useCampaign();
  const { fetchDetailCampaing } = useCampaign();

  useEffect(() => {
    fetchAllCampaing();
  }, []);

  const filtered = campaigns.filter(
    (biz) =>
      biz.title.toLowerCase().includes(search.toLowerCase()) ||
      biz.owner.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white px-32 ">
      <Navbar search={search} setSearch={setSearch} />
      <p className="text-white text-lg font-medium">
        {campaigns.length.toLocaleString()}{" "}
        <span className="text-primary-light">MicroBusiness</span>
      </p>

      {loading && <div>Loading campaigns...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filtered.map((biz, index) => (
          <div
            key={index}
            className="bg-zinc-900 rounded-lg overflow-visible relative"
          >
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
        ))}
      </div>
    </div>
  );
}
