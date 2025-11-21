"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type UserRewardProps = {
  address: string;
};

const UserReward = ({ address }: UserRewardProps) => {
  const { data: reward } = useScaffoldReadContract({
    contractName: "ChallengeRewards",
    functionName: "getReward",
    args: [address],
  });

  return <span>{reward?.toString() || 0}</span>;
};

export default UserReward;
