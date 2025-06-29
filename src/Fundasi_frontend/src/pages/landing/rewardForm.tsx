import React, { useState } from "react";

export default function RewardForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // logic to submit email
    alert(`Reward sent to: ${email}`);
  };

  const handleCancel = () => {
    setEmail("");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-6"
      >
        <h1 className="text-white text-xl md:text-2xl font-semibold text-center">
          Claim your reward — we’ll send it to your email
        </h1>

        <div className="bg-gradient-to-r from-[#398267] to-black p-[2px] rounded-lg">
          <input
            type="email"
            placeholder="Ex : user@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-[300px] md:w-[500px] px-4 py-3 rounded-lg bg-black border-none text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div className="w-[300px] md:w-[500px] flex justify-between">
          <div className="bg-gradient-to-r from-[#398267] to-[#A5CC86] p-[2px] rounded-full">
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-black text-white hover:bg-green-500 hover:text-black transition border-none"
            >
              Submit
            </button>
          </div>

          <div className="[background:linear-gradient(90deg,_#CC9186_0%,_#823939_100%)] p-[2px] rounded-full">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded-full bg-black text-white hover:bg-red-500 hover:text-black transition border-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}