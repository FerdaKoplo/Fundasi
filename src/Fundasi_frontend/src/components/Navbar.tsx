import React from "react";

interface NavbarProps {
  search: string;
  setSearch: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ search, setSearch }) => {
  return (
    <div className="flex items-center justify-between mb-6 relative">
      <h1 className="text-2xl font-bold green-gradient">Fundasi</h1>
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 mt-0 w-full max-w-lg">
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
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#398267] to-[#A5CC86] flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    </div>
  );
};

export default Navbar;