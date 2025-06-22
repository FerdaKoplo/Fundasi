import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";

interface MicroBusiness {
  id: string;
  title: string;
  author: string;
  image: string;
  daysLeft: number;
  funded: number;
  score: number;
}

const dummyData: MicroBusiness[] = [
  {
    id: "1",
    title: "Campaign Rajut Ferdi",
    author: "Rajut Ferdi corp.",
    image: "/images/dummy1.jpg",
    daysLeft: 35,
    funded: 80,
    score: 90,
  },
  {
    id: "2",
    title: "Campaign Mirza Dinsum",
    author: "Dinsum Mirza corp.",
    image: "/images/mirza-dinsum.jpg",
    daysLeft: 35,
    funded: 60,
    score: 90,
  },
  {
    id: "3",
    title: "Campaign Rajut Ferdi",
    author: "Rajut Ferdi corp.",
    image: "/images/dummy1.jpg",
    daysLeft: 35,
    funded: 80,
    score: -90,
  }
];

export default function MicroBusinessList() {
  const [search, setSearch] = useState("");
  const [businesses, setBusinesses] = useState<MicroBusiness[]>([]);

  useEffect(() => {
    setBusinesses(dummyData);
  }, []);

  const filtered = businesses.filter((biz) =>
    biz.title.toLowerCase().includes(search.toLowerCase()) ||
    biz.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 relative">
      <Navbar search={search} setSearch={setSearch}/>

      <p className="text-white text-lg font-medium">
        {businesses.length.toLocaleString()} <span className="text-primary-light">MicroBusiness</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filtered.map((biz) => (
          <div key={biz.id} className="bg-zinc-900 rounded-lg overflow-visible relative">
            <div className="relative">
              <img
                src={biz.image}
                alt={biz.title}
                className="w-full h-48 object-cover"
              />
              {biz.score >= 0 ? (
                <div className="absolute -top-5 -left-3 w-12 h-12 rounded-full p-1 bg-gradient-to-r from-[#398267] to-[#A5CC86]">
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-black text-white font-bold text-sm">
                    {biz.score}
                  </div>
                </div>
              ) : (
                <div className="absolute -top-5 -left-3 w-12 h-12 rounded-full p-1 bg-gradient-to-r from-[#CCB386] to-[#823939]">
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-black text-white font-bold text-sm">
                    {biz.score}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-base">{biz.title}</h2>
                    <p className="text-sm text-gray-400">{biz.author}</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-14">
                  <defs>
                    <linearGradient id="green-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#398267" />
                      <stop offset="100%" stopColor="#A5CC86" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#green-gradient)" d="M6 4a2 2 0 0 0-2 2v14l8-4 8 4V6a2 2 0 0 0-2-2H6z" />
                </svg>
              </div>
              <div className="flex items-center text-sm text-white gap-2">
                <span className="font-bold">{biz.daysLeft} days left</span>
                <span className="text-white/60">• {biz.funded}% funded</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}