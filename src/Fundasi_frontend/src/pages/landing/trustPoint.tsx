import React from 'react';

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  position: 'left' | 'right';
}

const CampaignTimeline: React.FC = () => {
  const steps: TimelineStep[] = [
    {
      id: 1,
      title: "Campaign Launched",
      description: "An entrepreneur or small business owner starts a microfunding campaign.",
      position: 'left'
    },
    {
      id: 2,
      title: "NFTs Purchased as Support Received",
      description: "Supporters can back the campaign by purchasing tiered NFTs. Each NFT represents both a funding contribution and a symbol of trust.",
      position: 'right'
    },
    {
      id: 3,
      title: "Supporter Badges Issued",
      description: "Based on the NFT tier (Level 1 to Level 5), each supporter receives a unique badge, reflecting their level of contribution.",
      position: 'left'
    },
    {
      id: 4,
      title: "Rewards Distributed (or Not)",
      description: "Depending on the campaign creator's setup, supporters may receive physical products, digital rewards, or simply social recognition.",
      position: 'right'
    },
    {
      id: 5,
      title: "Community Feedback via Votes",
      description: "Once a supporter purchases an NFT, they gain access to the vote system — allowing them to upvote or devote a campaign based on their experience.",
      position: 'left'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white px-8 md:px-16 lg:px-32 py-16">
      <div className="w-full">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-[#398267]"
               style={{ top: '60px', height: 'calc(100% - 180px)' }}></div>

          {/* Timeline Steps */}
          <div className="space-y-24">
            {steps.map((step) => (
              <div key={step.id} className="relative flex items-center">
                {/* Glow effect */}
                {step.id % 2 === 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-[#398267] opacity-20 rounded-full blur-[120px] z-0 pointer-events-none" />
                )}

                {/* Horizontal connector */}
                <div className={`absolute left-1/2 h-0.5 bg-[#398267] ${
                  step.position === 'left'
                    ? 'w-[150px] transform -translate-x-full'
                    : 'w-[120px]'
                }`}></div>

                {/* Step Number */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-20 h-20 ${
                  step.id % 2 === 1 ? 'bg-black border-2 border-[#398267] text-white' : 'bg-[#398267] text-black'
                } rounded-full flex items-center justify-center font-bold text-4xl z-10`}>
                  {step.id}.
                </div>

                {/* Step Content */}
                <div className={`w-[48%] ${step.position === 'left' ? 'pr-20' : 'ml-auto pl-20'}`}>
                  <div className="p-10">
                    <h3 className="text-3xl font-bold mb-4 text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-xl">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Title */}
        <div className="flex justify-end mt-32 mb-12">
          <div className="text-right">
            <h1 className="text-6xl font-bold green-gradient mb-4">
              Trust Point System
            </h1>
            <p className="text-2xl text-white font-medium">
              Step by Step Trust Building
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignTimeline;