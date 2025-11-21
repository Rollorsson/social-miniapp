"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import UserReward from "./_components/UserReward";
import { Address } from "~~/components/scaffold-eth";

const Leaderboard: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { data: verifiedUsers, isLoading: isLoadingUsers } = useScaffoldReadContract({
    contractName: "ChallengeRewards",
    functionName: "getVerifiedUsers",
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Community Leaderboard</h1>
        <p className="text-xl text-neutral-content">See who is leading the community and their rewards.</p>
        {connectedAddress && (
          <div className="mt-6 text-lg">
            Your Reward: <UserReward address={connectedAddress} />
          </div>
        )}
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="!bg-primary !text-primary-content">Address</th>
                <th className="!bg-primary !text-primary-content text-right">Reward</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingUsers ? (
                <tr>
                  <td colSpan={2} className="text-center py-4">
                    <span className="loading loading-spinner"></span>
                  </td>
                </tr>
              ) : (
                verifiedUsers?.map((userAddress: string) => (
                  <tr key={userAddress} className="hover:bg-base-200">
                    <td className="w-full max-w-0 truncate">
                      <Address address={userAddress} />
                    </td>
                    <td className="text-right">
                      <UserReward address={userAddress} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

