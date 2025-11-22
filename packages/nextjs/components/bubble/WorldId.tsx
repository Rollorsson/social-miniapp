"use client";

import React from "react";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useIdentity } from "~~/context/IdentityContext";

export const WorldId = () => {
  const { setIsWorldIdVerified } = useIdentity();

  const handleProof = async (result: ISuccessResult) => {
    // For the demo, we'll assume client-side verification is enough
    // In a real app, you'd send this to a backend for verification
    console.log("Proof received from IDKit, assuming success for demo:", result);
    setIsWorldIdVerified(true);
  };

  const onSuccess = () => {
    console.log("World ID proof generated successfully!");
  };

  return (
    <IDKitWidget
      action="bubble-verify"
      onSuccess={onSuccess}
      handleVerify={handleProof}
      app_id="app_31a3b2ae0f731dd2b52533a942871ca3" // Your actual App ID
    >
      {({ open }) => (
        <button className="btn btn-primary" onClick={open}>
          Verify with World ID
        </button>
      )}
    </IDKitWidget>
  );
};
