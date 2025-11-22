"use client";

import { useState } from "react";
import { SelfID } from "@self.id/web";
import { useAccount } from "wagmi";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

// Helper function to create a SelfID instance
async function createSelfID(address: `0x${string}`) {
  const client = createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum),
  });

  const self = await SelfID.authenticate({
    authPlugin: "ethers",
    provider: client,
    address,
  });
  return self;
}

export const SelfId = () => {
  const { address, isConnected } = useAccount();
  const [did, setDid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const self = await createSelfID(address);
      if (self.id) {
        setDid(self.id);
      }
    } catch (error) {
      console.error("Error verifying with Self.id:", error);
    }
    setIsLoading(false);
  };

  if (!isConnected) {
    return <p>Please connect your wallet to verify with Self.id.</p>;
  }

  return (
    <div>
      {did ? (
        <div>
          <p>Verified!</p>
          <p>Your DID is: {did}</p>
        </div>
      ) : (
        <button onClick={handleVerify} disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify with Self.id"}
        </button>
      )}
    </div>
  );
};
