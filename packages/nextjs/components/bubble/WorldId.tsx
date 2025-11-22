"use client";

import React from "react";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";

export const WorldId = () => {
  const handleProof = async (result: ISuccessResult) => {
    // This is where you would send the proof to your backend for verification
    console.log("Proof received from IDKit:\n", result);
    const res = await fetch("/api/verify", { // This API route doesn't exist yet, we'll create it later
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ proof: result }),
    });
    if (!res.ok) {
      throw new Error("Verification failed.");
    }
    console.log("Successfully verified proof with your backend.");
  };

  const onSuccess = () => {
    // This is a client-side callback that is triggered after a successful proof is generated
    console.log("Proof generated successfully!");
  };

  return (
    <IDKitWidget
      action="bubble-verify" // An arbitrary string to identify the action
      onSuccess={onSuccess}
      handleVerify={handleProof}
      app_id: "app_31a3b2ae0f731dd2b52533a942871ca3" // Your actual App ID from Worldcoin Developer Portal
    >
      {({ open }) => (
        <button className="btn btn-primary" onClick={open}>
          Verify with World ID
        </button>
      )}
    </IDKitWidget>
  );
};
