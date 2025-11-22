"use client";

import React from "react";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import type { NextPage } from "next";

const Verify: NextPage = () => {
  const handleProof = async (result: ISuccessResult) => {
    console.log("Proof received from IDKit:\n", result);
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ proof: result }),
    });
    if (!res.ok) {
      throw new Error("Verification failed.");
    }
    console.log("Successfully verified proof.");
  };

  const onSuccess = (result: ISuccessResult) => {
    console.log("Success!", result);
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-2xl mb-2">Verify Your Identity</span>
          <span className="block text-4xl font-bold">with World ID</span>
        </h1>
        <p className="text-center text-lg">Prove you are a unique human without revealing your identity.</p>
      </div>

      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <IDKitWidget
            action="my_action"
            onSuccess={onSuccess}
            handleVerify={handleProof}
            app_id="app_staging_abc123" // TODO: Replace with your App ID
          >
            {({ open }) => (
              <button className="btn btn-primary" onClick={open}>
                Verify with World ID
              </button>
            )}
          </IDKitWidget>
        </div>
      </div>
    </div>
  );
};

export default Verify;
