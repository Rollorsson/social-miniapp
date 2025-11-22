"use client";

import { useAccount } from "wagmi";
import useSafe from "~~/hooks/bubble/useSafe";
import { Address } from "~~/components/scaffold-eth";
import { useIdentity } from "~~/context/IdentityContext";

export const UserProfile = () => {
  const { address: connectedAddress } = useAccount();
  const { safeAddress, isSafeDeployed, loading: safeLoading } = useSafe();
  const { isWorldIdVerified, selfIdProfile } = useIdentity();

  if (!connectedAddress) {
    return <p>Please connect your wallet to view your profile.</p>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        {selfIdProfile?.avatar && (
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={selfIdProfile.avatar} alt="User Avatar" />
            </div>
          </div>
        )}
        <h2 className="card-title text-3xl">{selfIdProfile?.name || "Anonymous User"}</h2>
        <p>{selfIdProfile?.description}</p>
        <div className="divider"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="p-4 border rounded-lg">
            <p className="font-bold">Connected Wallet:</p>
            <Address address={connectedAddress} />
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-bold">World ID Status:</p>
            {isWorldIdVerified ? (
              <span className="text-success font-bold">Verified</span>
            ) : (
              <span className="text-error font-bold">Not Verified</span>
            )}
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-bold">Safe Wallet:</p>
            {safeLoading ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : isSafeDeployed && safeAddress ? (
              <Address address={safeAddress} />
            ) : (
              <p>No Safe wallet found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
