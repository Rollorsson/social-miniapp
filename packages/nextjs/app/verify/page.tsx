"use client";

import { SelfId } from "~~/components/bubble/SelfId";
import { WorldId } from "~~/components/bubble/WorldId";

const VerifyPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-5xl font-bold">Verify Your Identity</h1>
        <p className="mt-4 text-xl text-neutral-content">
          Prove you're a unique human by verifying with World ID and Self.id.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border rounded-xl">
            <h2 className="text-2xl font-bold">Step 1: World ID</h2>
            <p className="mt-2">Prove you are a unique person.</p>
            <div className="mt-4">
              <WorldId />
            </div>
          </div>
          <div className="p-6 border rounded-xl">
            <h2 className="text-2xl font-bold">Step 2: Self.id</h2>
            <p className="mt-2">Create your decentralized identity.</p>
            <div className="mt-4">
              <SelfId />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyPage;
