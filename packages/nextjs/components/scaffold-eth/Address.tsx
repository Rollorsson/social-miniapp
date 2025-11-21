"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Address as AddressType,
  isAddress,
} from "viem";
import { useEnsAvatar, useEnsName } from "wagmi";
import { hardhat } from "wagmi/chains";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { cn } from "~~/utils/scaffold-eth";

type AddressProps = {
  address?: AddressType;
  className?: string;
  format?: "short" | "long";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
};

const blockieSizeMap = {
  xs: 6,
  sm: 7,
  base: 8,
  lg: 9,
  xl: 10,
  "2xl": 12,
  "3xl": 15,
};

/**
 * Displays an address (or ENS) with a Blockie image and option to copy.
 */
export const Address = ({
  address,
  className,
  format,
  size = "base",
}: AddressProps) => {
  const [ens, setEns] = useState<string | null>();
  const [ensAvatar, setEnsAvatar] = useState<string | null>();
  const { targetNetwork } = useTargetNetwork();

  const { data: fetchedEns } = useEnsName({
    address: address,
    chainId: 1,
  });
  const { data: fetchedEnsAvatar } = useEnsAvatar({
    name: fetchedEns ?? undefined,
    chainId: 1,
  });

  // We need to apply this pattern to avoid Hydration errors.
  useEffect(() => {
    if (fetchedEns) {
      setEns(fetchedEns);
    }
  }, [fetchedEns]);

  useEffect(() => {
    if (fetchedEnsAvatar) {
      setEnsAvatar(fetchedEnsAvatar);
    }
  }, [fetchedEnsAvatar]);

  // Skeleton UI
  if (!address) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAddress(address)) {
    return <span className="text-error">Invalid address</span>;
  }

  const blockExplorerAddressLink = getBlockExplorerAddressLink(
    targetNetwork,
    address,
  );
  let displayAddress = address?.slice(0, 5) + "..." + address?.slice(-4);

  if (ens) {
    displayAddress = ens;
  } else if (format === "long") {
    displayAddress = address;
  }

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex-shrink-0">
        <BlockieAvatar
          address={address}
          ensImage={ensAvatar}
          size={(blockieSizeMap[size] * 24) / blockieSizeMap["base"]}
        />
      </div>
      {targetNetwork.id === hardhat.id ? (
        <span className={`ml-1.5 text-${size} font-normal`}>
          {displayAddress}
        </span>
      ) : (
        <Link
          className={cn(
            "ml-1.5 text-sm font-normal",
            blockExplorerAddressLink ? "hover:underline" : "",
          )}
          href={blockExplorerAddressLink as string}
          target="_blank"
          rel="noopener noreferrer"
        >
          {displayAddress}
        </Link>
      )}
    </div>
  );
};