import React from "react";
import { CheckSquare, FileText, Shield, Search } from "lucide-react";

const WhyUseUs = () => {
  const items = [
    {
      title: "No Collateral Required",
      description:
        "Unlike banks or loan providers, Fundasi doesn't require any physical collateral. Microbusinesses can start a campaign purely based on trust, reputation, and community support — removing traditional barriers to access.",
      icon: <CheckSquare className="w-8 h-8 text-[#398267]" />,
    },
    {
      title: "NFT = Proof of Support",
      description:
        "Each NFT purchased isn’t just a digital asset — it’s a symbol of real contribution. Backers receive NFT badges based on their support tier, which act as receipts, social proof, and sometimes access to future perks.",
      icon: <FileText className="w-8 h-8 text-[#398267]" />,
    },
    {
      title: "Trust & Reputation System",
      description:
        "Every campaign builds its own Trust Score over time. Supporters can upvote or downvote campaigns after supporting, giving weight to genuine experience. This community-based trust layer increases accountability and long-term credibility.",
      icon: <Shield className="w-8 h-8 text-[#398267]" />,
    },
    {
      title: "Transparent Fund Tracking",
      description:
        "All transactions are stored on-chain, meaning everyone can see how much a campaign has raised, where funds are going, and whether promises are fulfilled — without relying on third parties. Transparency is built into the system.",
      icon: <Search className="w-8 h-8 text-[#398267]" />,
    },
  ];

  return (
    <section className="bg-black text-white pt-24 pb-20 px-6 min-h-screen relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-[#34ce96c0] opacity-20 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-[#A5CC86] to-[#2a5d4b] bg-clip-text text-transparent mb-2 text-left">
          Why Use Fundasi Than Others?
        </h2>
        <p className="text-gray-400 mb-16 text-left">
          What makes us different from traditional platforms
        </p>
        <div className="relative w-full">
          {/* Cards wrapper */}
          <div className="grid grid-cols-2 gap-x-[20rem] gap-y-12">
            {items.map((item, index) => (
              <div
                key={index}
                className="black-gradient rounded-lg p-6 shadow-lg border border-gray-800 relative"
              >
                {/* ICON CONNECTOR */}
                {index === 0 && (
                  <div className="absolute right-[-2.5rem] top-1/2 transform -translate-y-1/2 hidden md:block">
                    <CheckSquare className="w-8 h-8 text-[#398267]" />
                  </div>
                )}
                {index === 1 && (
                  <div className="absolute left-[-2.5rem] top-1/2 transform -translate-y-1/2 hidden md:block">
                    <FileText className="w-8 h-8 text-[#398267]" />
                  </div>
                )}
                {index === 2 && (
                  <div className="absolute right-[-2.5rem] top-1/2 transform -translate-y-1/2 hidden md:block">
                    <Shield className="w-8 h-8 text-[#398267]" />
                  </div>
                )}
                {index === 3 && (
                  <div className="absolute left-[-2.5rem] top-1/2 transform -translate-y-1/2 hidden md:block">
                    <Search className="w-8 h-8 text-[#398267]" />
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUseUs;
