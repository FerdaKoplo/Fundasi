import { useEffect, useState } from "react";
import { useCampaign } from "../../../hooks/useCampaign";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold green-gradient">Fundasi</h1>
        <div className="relative w-full max-w-lg mx-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-white opacity-60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search microbusiness, authors"
            className="w-full pl-10 pr-4 py-2 rounded-full text-white placeholder-white/60 focus:outline-none black-gradient  bg-opacity-20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-8 h-8 rounded-full border border-green-400 flex items-center justify-center">
          <div className="w-5 h-5 bg-green-400 rounded-full"></div>
        </div>
      </div>

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
              <h2 className="text-white font-semibold text-base">
                {biz.title}
              </h2>
              <p className="text-sm text-gray-400 mb-2">{biz.owner.username}</p>
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
                <Link to={""}>
                  <FaEye />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
