import React from "react";
import { HiMiniMegaphone } from "react-icons/hi2";
import Navbar from "../../../components/Navbar";

const UserProfile = () => {
  // Dummy data (replace with data from Motoko Web3 later)
  const user = {
    name: "Mirza Dinsum",
    projects: 3,
    joined: "May 2025",
    status: "Trusted",
    contributions: [
      { level: 1 },
      { level: 2 },
      { level: 3 },
    ],
  };

  const [search, setSearch] = React.useState("");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4">
      {/* Navbar */}
      <div className="w-full max-w-6xl">
        <Navbar search={search} setSearch={setSearch} />
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center pt-[30px]">
        <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center text-4xl">
          👤
        </div>
        <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {user.projects} Campaign Project &nbsp;&bull;&nbsp; Joined {user.joined} &nbsp;&bull;&nbsp; {user.status}
        </p>
      </div>

      {/* Navigation Label */}
      <div className="mt-10 text-gray-400 uppercase tracking-widest text-sm">
        Navigation
      </div>

      {/* Navigation Tabs */}
      <div className="relative mt-2 text-base w-[600px]">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] border-t border-gray-700"></div>
        <div className="flex space-x-10 pt-2 justify-center">
          <span className="cursor-pointer">About</span>
          <span className="cursor-pointer">Campaign</span>
          <span className="cursor-pointer">Trust Point</span>
          <span className="cursor-pointer font-semibold green-gradient">Contribution</span>
        </div>
      </div>

      {/* Contribution Section */}
      <div className="mt-6 space-y-7 w-full max-w-xl px-4">
        {user.contributions.map((contribution, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-6 h-6 text-white">
              <HiMiniMegaphone className="w-full h-full" />
            </div>
            <div className="flex-1 black-gradient p-4 rounded-xl shadow border border-[#2c2c2c] text-sm leading-relaxed">
              <span className="text-white">{user.name} Has Bought Rajut Ferdi </span>
              <span className="font-bold text-white">Level {contribution.level} </span>
              <span className="font-bold" style={{ color: "#398267" }}>NFT</span>
              <span className="text-white">!</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
