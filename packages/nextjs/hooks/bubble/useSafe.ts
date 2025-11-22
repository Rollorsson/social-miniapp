import { useState, useEffect, useCallback } from "react";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";

const useSafe = () => {
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();

  const [safe, setSafe] = useState<Safe | null>(null);
  const [safeAddress, setSafeAddress] = useState<string | null>(null);
  const [isSafeDeployed, setIsSafeDeployed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getSafeServiceUrl = () => {
    // Add other networks as needed for the demo
    switch (chainId) {
      case 1:
        return "https://safe-transaction-mainnet.safe.global";
      case 11155111: // Sepolia
        return "https://safe-transaction-sepolia.safe.global";
      default:
        return "https://safe-transaction-sepolia.safe.global"; // Default to Sepolia for demo
    }
  };

  // Check for existing safes
  const checkForExistingSafe = useCallback(async () => {
    if (!connectedAddress) return;
    setLoading(true);
    try {
      const safeService = new SafeApiKit({
        txServiceUrl: getSafeServiceUrl(),
        ethAdapter: new EthersAdapter({ ethers, signerOrProvider: walletClient }),
      });
      const safes = await safeService.getSafesByOwner(connectedAddress);
      if (safes.safes.length > 0) {
        // For the demo, we'll just use the first safe found
        const firstSafeAddress = safes.safes[0];
        setSafeAddress(firstSafeAddress);
        setIsSafeDeployed(true);
        console.log("Found existing Safe:", firstSafeAddress);
      } else {
        console.log("No existing Safe found for this owner.");
        setIsSafeDeployed(false);
      }
    } catch (error) {
      console.error("Error checking for existing safe:", error);
    }
    setLoading(false);
  }, [connectedAddress, walletClient, chainId]);

  // Deploy a new 1-of-1 Safe
  const deployNewSafe = useCallback(async () => {
    if (!walletClient || !connectedAddress) return;
    setLoading(true);
    try {
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: walletClient,
      });
      const safeFactory = await Safe.create({ ethAdapter });
      const safeAccountConfig = {
        owners: [connectedAddress],
        threshold: 1,
      };
      const newSafe = await safeFactory.deploySafe({ safeAccountConfig });
      const newSafeAddress = await newSafe.getAddress();

      setSafe(newSafe);
      setSafeAddress(newSafeAddress);
      setIsSafeDeployed(true);
      console.log("New Safe deployed:", newSafeAddress);
    } catch (error) {
      console.error("Error deploying new safe:", error);
    }
    setLoading(false);
  }, [walletClient, connectedAddress]);

  useEffect(() => {
    if (connectedAddress && walletClient) {
      checkForExistingSafe();
    }
  }, [connectedAddress, walletClient, checkForExistingSafe]);

  return { safe, safeAddress, isSafeDeployed, loading, deployNewSafe, checkForExistingSafe };
};

export default useSafe;
