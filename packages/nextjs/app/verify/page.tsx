"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useSelf } from "~~/hooks/useSelf";

const Verify: NextPage = () => {
  const { address } = useAccount();
  const { verifyWithSelf } = useSelf();
  const [isLoading, setIsLoading] = useState(false);

  const { data: isVerified } = useScaffoldReadContract({
    contractName: "ChallengeRewards",
    functionName: "isVerified",
    args: [address],
  });

  const { writeContractAsync: verifyUser } = useScaffoldWriteContract("ChallengeRewards");

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const selfVerified = await verifyWithSelf();
      if (selfVerified) {
        await verifyUser({
          functionName: "verifyUser",
        });
        toast.success("Verification successful!");
      } else {
        toast.error("Self Protocol verification failed.");
      }
    } catch (e) {
      console.error("Error verifying user:", e);
      toast.error("An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-5xl font-bold">
          Verify Your Identity
        </h1>
        <p className="mt-4 text-xl text-neutral-content">
          Prove you are a unique person to join our community.
        </p>

        <div className="mt-8">
          {isVerified ? (
            <p className="text-2xl text-success">You are already verified!</p>
          ) : (
            <button
              onClick={handleVerify}
              className="btn btn-primary btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Verify with Self Protocol"
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Verify;
