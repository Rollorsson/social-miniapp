import { useWalletClient } from "wagmi";

/**
 * @dev Gets a viem wallet client object from wagmi
 */
export const useEthersSigner = () => {
  const { data: walletClient } = useWalletClient();
  return walletClient;
};