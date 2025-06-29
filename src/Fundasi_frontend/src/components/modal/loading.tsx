import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 via-lime-400 to-green-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-glow">
        Fundasi
      </h1>

      <p className="mt-4 text-gray-400 text-sm animate-pulse">Loading...</p>

      <style>
        {`
        @keyframes shine {
          0% { background-position: 200% center; color: white; }
          50% { background-position: 100% center; color: black; }
          100% { background-position: 0% center; color: white; }
        }

        .animate-glow {
          animation: shine 3s ease-in-out infinite;
        }
        `}
      </style>
    </div>
  );
};

export default Loading;
