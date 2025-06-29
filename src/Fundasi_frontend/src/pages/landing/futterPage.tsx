import React from 'react';

const FutterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-24 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow Left - Half Circle */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[1000px] bg-[#398267] opacity-40 rounded-r-full blur-[160px] z-0" />
      {/* Background Glow Right - Half Circle */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[1000px] bg-[#398267] opacity-40 rounded-l-full blur-[160px] z-0" />

      <div className="z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-[150px] bg-[linear-gradient(to_bottom,_#A5CC86_0%,_#000000_100%)] text-transparent bg-clip-text">
          Empower Small Business<br />
          <span className="block">One NFT at a Time</span>
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button className="bg-[#1F1F1F] text-white rounded-full px-8 py-3 text-lg font-medium shadow-md hover:opacity-80 transition">
            Launch Your Campaign
          </button>
          <button className="bg-[#1F1F1F] text-white rounded-full px-8 py-3 text-lg font-medium shadow-md hover:opacity-80 transition">
            Start Supporting
          </button>
        </div>
      </div>
    </div>
  );
};

export default FutterPage;
