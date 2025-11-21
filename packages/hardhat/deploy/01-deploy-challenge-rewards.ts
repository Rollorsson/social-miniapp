import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "ChallengeRewards" using the deployer account and
 * constructor arguments set to an empty array.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployChallengeRewards: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the first account created by Hardhat, which is user zero.
    You can easily change the deployer account here by replacing `user` with the name of the account you want to use.
    */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("ChallengeRewards", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const challengeRewards = await hre.ethers.getContract<Contract>("ChallengeRewards", deployer);
  console.log("👋 ChallengeRewards deployed to:", await challengeRewards.getAddress());
};

export default deployChallengeRewards;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags ChallengeRewards
deployChallengeRewards.tags = ["ChallengeRewards"];
