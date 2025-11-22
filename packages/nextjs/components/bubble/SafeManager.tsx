"use client";

import useSafe from "~~/hooks/bubble/useSafe";
import { Address } from "~~/components/scaffold-eth";

export const SafeManager = () => {
  const { safeAddress, isSafeDeployed, loading, deployNewSafe, checkForExistingSafe } = useSafe();

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Your Safe Wallet</h2>
        {loading && <span className="loading loading-spinner text-primary"></span>}
        {!loading && (
          <div>
            {isSafeDeployed && safeAddress ? (
              <div>
                <p>Found an existing Safe wallet:</p>
                <Address address={safeAddress} />
              </div>
            ) : (
              <div>
                <p>No Safe wallet found for your address on this network.</p>
                <button className="btn btn-primary mt-4" onClick={deployNewSafe} disabled={loading}>
                  Deploy New Safe
                </button>
              </div>
            )}
            <button className="btn btn-secondary mt-4 ml-2" onClick={checkForExistingSafe} disabled={loading}>
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
