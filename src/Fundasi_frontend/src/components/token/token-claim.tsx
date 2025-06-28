import React from "react";
import { useToken } from "../../hooks/useToken";
import { useAuth } from "../../context/auth-context";

const TokenClaim = () => {
  const { claimInitialToken, isClaiming, claimSuccess, claimError } =
    useToken();
  const { user } = useAuth();
  const alreadyClaimed = (user?.trustPoints ?? 0) > 0;

  return (
    <div className="space-y-2">
      <button
        onClick={claimInitialToken}
        disabled={isClaiming || alreadyClaimed}
        className="bg-green-500 text-black px-6 py-2 rounded-full hover:bg-green-400 transition"
      >
        {isClaiming
          ? "Claiming..."
          : alreadyClaimed
          ? "Token sudah diklaim"
          : "Claim Free Token 🎁"}
      </button>

      {claimSuccess && <p className="text-green-400 text-sm">{claimSuccess}</p>}
      {claimError && <p className="text-red-400 text-sm">{claimError}</p>}
    </div>
  );
};

export default TokenClaim;
