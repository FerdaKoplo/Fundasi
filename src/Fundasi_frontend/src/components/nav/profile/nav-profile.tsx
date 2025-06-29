import React from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useToken } from "../../../hooks/useToken";

const NavbarProfile = () => {
  const { tokenBalance, loadingBalance, balanceError } = useToken();

  const displayBalance = () => {
    if (loadingBalance) return "Loading...";
    if (balanceError) return "Err";
    return `${Number(tokenBalance ?? 0n) / 100_000_000} TOKEN`;
  };
  return (
    <nav className="flex items-center justify-between p-6 relative text-white">
      <Link to={"/campaigns"}>
        <h1 className="text-2xl font-bold green-gradient">Fundasi</h1>
      </Link>

      <div className="flex items-center gap-6">
        {/* ✅ TOKEN BALANCE */}
        <div className="text-sm text-gray-300 bg-gray-800 px-4 py-1 rounded-full">
          {displayBalance()}
        </div>

        {/* ✅ PROFILE LINK */}
        <Link to={"/user-profile"}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#398267] to-[#A5CC86] flex items-center justify-center">
            <div className="text-[#A5CC86] text-xs bg-black w-6 h-6 rounded-full flex justify-center items-center">
              <FaUser />
            </div>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default NavbarProfile;
