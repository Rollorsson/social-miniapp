"use client";

import { SafeManager } from "~~/components/bubble/SafeManager";

const SafePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Safe Management</h1>
      <p className="mb-4">
        Check for an existing Safe wallet or deploy a new one. This demo will find the first Safe associated with your
        connected wallet.
      </p>
      <SafeManager />
    </div>
  );
};

export default SafePage;
