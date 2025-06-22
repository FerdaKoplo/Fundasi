import { useEffect, useState } from "react";

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
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold green-gradient">Fundasi</h1>
        <div className="relative w-full max-w-lg mx-10">
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
    <svg className="w-5 h-5 text-white opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
    </svg>
  </div>
  <input
    type="text"
    placeholder="Search microbusiness, authors"
    className="w-full pl-10 pr-4 py-2 rounded-full text-white placeholder-white/60 focus:outline-none bg-gradient-to-r from-white to-[#2D2D2D] bg-opacity-20"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
        <div className="w-8 h-8 rounded-full border border-green-400 flex items-center justify-center">
          <div className="w-5 h-5 bg-green-400 rounded-full"></div>
        </div>
      </div>

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
              <h2 className="text-white font-semibold text-base">{biz.title}</h2>
              <p className="text-sm text-gray-400 mb-2">{biz.author}</p>
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
