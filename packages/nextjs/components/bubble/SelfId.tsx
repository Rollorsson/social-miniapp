"use client";

import { useState } from "react";
import { SelfID } from "@self.id/web";
import { useAccount } from "wagmi";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";
import { useIdentity } from "~~/context/IdentityContext";

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
  const { selfIdProfile, setSelfIdProfile } = useIdentity();
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const self = await createSelfID(address);
      if (self.id) {
        const profile = await self.get("basicProfile");
        setSelfIdProfile({
          name: profile?.name,
          description: profile?.description,
          avatar: profile?.image
            ? `https://ipfs.io/ipfs/${profile.image.original.src.split("://")[1]}`
            : undefined,
        });
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
      {selfIdProfile ? (
        <div>
          <p>Verified!</p>
          <p>Welcome, {selfIdProfile.name || "friend"}.</p>
        </div>
      ) : (
        <button onClick={handleVerify} disabled={isLoading} className="btn btn-primary">
          {isLoading ? "Verifying..." : "Connect with Self.id"}
        </button>
      )}
    </div>
  );
};
