import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the "QuizReward" contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployQuizReward: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // This is a placeholder URI. In a real application, you would upload your NFT metadata to IPFS or another decentralized storage
  // and get a URI. For example: "ipfs://bafkreie..."
  const tokenURI = "https://raw.githubusercontent.com/scaffold-eth/se-2-assets/main/misc/pok.json";

  await deploy("QuizReward", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer, tokenURI],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the transaction. There is no effect on live networks.
    autoMine: true,
  });
};

export default deployQuizReward;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags QuizReward
deployQuizReward.tags = ["QuizReward"];
