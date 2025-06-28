import { useEffect, useState } from "react";
import { Fundasi_backend } from "../../../declarations/Fundasi_backend";
import { icrc1_ledger } from "../../../declarations/icrc1_ledger";
import { useAuth } from "../context/auth-context";
import { Principal } from "@dfinity/principal";

export const useToken = () => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const [tokenBalance, setTokenBalance] = useState<bigint | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const { principalId, refreshUser } = useAuth();

  const fetchTokenBalance = async () => {
    if (!principalId) return;
    setLoadingBalance(true);
    setBalanceError(null);

    try {
      const balance = await icrc1_ledger.icrc1_balance_of({
        owner: Principal.fromText(principalId),
        subaccount: [],
      });
      setTokenBalance(balance);
    } catch (err) {
      console.error("Gagal mengambil saldo token:", err);
      setBalanceError("Gagal mengambil saldo token.");
    } finally {
      setLoadingBalance(false);
    }
  };

  const claimInitialToken = async () => {
    setIsClaiming(true);
    setClaimSuccess(null);
    setClaimError(null);

    try {
      const result = await Fundasi_backend.claimInitialToken();

      if ("ok" in result) {
        setClaimSuccess(result.ok);
        await refreshUser();
        await fetchTokenBalance();
      } else {
        setClaimError(result.err);
      }
    } catch (err) {
      console.error("Error claiming token:", err);
      setClaimError("Terjadi kesalahan saat mengklaim token.");
    } finally {
      setIsClaiming(false);
    }
  };

  const purchaseNFT = async (nftId: number) => {
    setIsPurchasing(true);
    setPurchaseSuccess(null);
    setPurchaseError(null);

    try {
      const result = await Fundasi_backend.purchaseNFT(BigInt(nftId));
      if ("ok" in result) {
        setPurchaseSuccess("Berhasil membeli NFT!");
        await fetchTokenBalance();
      } else if ("Err" in result) {
        setPurchaseError(result.Err);
      }
    } catch (err) {
      console.error("Gagal membeli NFT:", err);
      setPurchaseError("Gagal membeli NFT.");
    } finally {
      setIsPurchasing(false);
    }
  };

  useEffect(() => {
    fetchTokenBalance();
  }, [principalId]);

  return {
    // Token related
    claimInitialToken,
    isClaiming,
    claimSuccess,
    claimError,
    tokenBalance,
    loadingBalance,
    balanceError,
    fetchTokenBalance,

    // NFT purchase
    purchaseNFT,
    isPurchasing,
    purchaseSuccess,
    purchaseError,
  };
};
