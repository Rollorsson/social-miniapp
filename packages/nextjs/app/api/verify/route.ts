import { type NextRequest, NextResponse } from "next/server";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import deployedContracts from "~~/contracts/deployedContracts";

export async function POST(req: NextRequest) {
  const { proof, userAddress } = await req.json();
  console.log("Received proof for verification:", { proof, userAddress });

  const app_id = process.env.WORLDCOIN_APP_ID;
  const action = "my_action";

  if (!app_id) {
    return NextResponse.json({ success: false, error: "WORLDCOIN_APP_ID not set" }, { status: 500 });
  }

  const verifyRes = await fetch(`https://developer.worldcoin.org/api/v1/verify/${app_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...proof, action }),
  });

  const verifyJson = await verifyRes.json();
  console.log("Verification response from Worldcoin:", verifyJson);

  if (verifyRes.ok) {
    console.log("Proof verified successfully!");

    try {
      const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error("DEPLOYER_PRIVATE_KEY not set");
      }

      // TODO: Use the correct RPC provider for World Chain
      const provider = new JsonRpcProvider("http://127.0.0.1:8545"); // Using local hardhat node for now
      const signer = new Wallet(privateKey, provider);

      const chainId = 31337; // Hardhat chainId
      const contractAddress = deployedContracts[chainId].ChallengeRewards.address;
      const contractAbi = deployedContracts[chainId].ChallengeRewards.abi;

      const contract = new Contract(contractAddress, contractAbi, signer);

      const tx = await contract.verifyUser(userAddress);

      await tx.wait();

      console.log("Transaction successful:", tx.hash);
      return NextResponse.json({ success: true, txHash: tx.hash });
    } catch (error: any) {
      console.error("On-chain transaction failed:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ success: false, ...verifyJson }, { status: 400 });
  }
}
