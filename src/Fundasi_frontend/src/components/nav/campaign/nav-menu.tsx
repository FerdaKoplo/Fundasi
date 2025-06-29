import React from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import LogoutButton from "../../auth/LogoutButton";
import { useAuth } from "../../../context/auth-context";

interface NavbarProps {
  search: string;
  setSearch: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ search, setSearch }) => {
  const { logout, isAuthenticated } = useAuth();
  return (
    <div className="flex items-center bg-black justify-between p-6 sticky top-0">
      <Link to={"/campaigns"}>
        <h1 className="text-2xl font-bold green-gradient">Fundasi</h1>
      </Link>

      <div className="top-0 mt-0 w-full max-w-lg">
        <div className="relative">
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
            className="w-full pl-12 pr-4 py-2 rounded-full text-white placeholder-white/60 focus:outline-none black-gradient"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <Link to={"/user-profile"}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#398267] to-[#A5CC86] flex items-center justify-center">
          <div className="text-[#A5CC86] text-xs bg-black w-6 h-6 rounded-full flex justify-center items-center">
            <FaUser />
          </div>
        </div>
      </Link>
      {isAuthenticated && (
        <div className="ml-4">
          <LogoutButton onClick={logout} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
