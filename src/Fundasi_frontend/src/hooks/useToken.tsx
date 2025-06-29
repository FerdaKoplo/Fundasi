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

  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

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

  const transferTokenToBackend = async (amount: bigint) => {
    if (!principalId) {
      setTransferError("User principal not found.");
      return;
    }

    try {
      setIsTransferring(true);
      setTransferError(null);

      const canisterPrincipal = await Fundasi_backend.getCanisterPrincipal();

      const result = await icrc1_ledger.icrc1_transfer({
        from_subaccount: [],
        to: {
          owner: Principal.fromText(canisterPrincipal.toString()),
          subaccount: [],
        },
        amount,
        fee: [],
        memo: [],
        created_at_time: [],
      });

      if ("Err" in result) {
        const errObj = result.Err;

        let errMsg = "Unknown error";
        if ("GenericError" in errObj) {
          errMsg = errObj.GenericError.message;
        } else if ("InsufficientFunds" in errObj) {
          errMsg =
            "Insufficient funds: balance = " +
            errObj.InsufficientFunds.balance.toString();
        } else if ("BadFee" in errObj) {
          errMsg =
            "Bad fee: expected = " + errObj.BadFee.expected_fee.toString();
        } else if ("Duplicate" in errObj) {
          errMsg =
            "Duplicate transaction: id = " +
            errObj.Duplicate.duplicate_of.toString();
        } else if ("BadBurn" in errObj) {
          errMsg =
            "Bad burn: min = " + errObj.BadBurn.min_burn_amount.toString();
        } else if ("InsufficientAllowance" in errObj) {
          errMsg =
            "Insufficient allowance: " +
            (
              errObj as { InsufficientAllowance: { allowance: bigint } }
            ).InsufficientAllowance.allowance.toString();
        } else if ("TemporarilyUnavailable" in errObj) {
          errMsg = "Ledger temporarily unavailable.";
        } else if ("TooOld" in errObj) {
          errMsg = "Transaction too old.";
        } else if ("CreatedInFuture" in errObj) {
          errMsg =
            "Transaction created in future: time = " +
            errObj.CreatedInFuture.ledger_time.toString();
        }

        setTransferError(errMsg);
        console.error("Transfer token error:", errMsg);
      }

      return result;
    } catch (err) {
      console.error("Transfer token exception:", err);
      setTransferError("Terjadi kesalahan saat transfer token.");
    } finally {
      setIsTransferring(false);
    }
  };

  const purchaseNFT = async (campaignId: number, level: string) => {
    setIsPurchasing(true);
    setPurchaseSuccess(null);
    setPurchaseError(null);

    try {
      const result = await Fundasi_backend.purchaseNFT(
        BigInt(campaignId),
        level
      );

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
    transferTokenToBackend,

    // NFT purchase
    purchaseNFT,
    isPurchasing,
    purchaseSuccess,
    purchaseError,
  };
};
