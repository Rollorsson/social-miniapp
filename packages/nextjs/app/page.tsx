"use client";

import type { NextPage } from "next";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-5xl font-bold">
          Welcome to the Social Mini-App
        </h1>

        <p className="mt-4 text-xl text-neutral-content">
          A decentralized application for the ETHGlobal hackathon.
        </p>

        <div className="mt-8">
          <ConnectButton />
        </div>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-12 sm:w-full">
          <Link href="/verify" legacyBehavior>
            <a className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-primary-focus focus:text-primary-focus">
              <h3 className="text-2xl font-bold">Verify Identity &rarr;</h3>
              <p className="mt-4 text-xl">
                Verify your identity using Self Protocol to join the community.
              </p>
            </a>
          </Link>

          <Link href="/leaderboard" legacyBehavior>
            <a className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-primary-focus focus:text-primary-focus">
              <h3 className="text-2xl font-bold">Leaderboard &rarr;</h3>
              <p className="mt-4 text-xl">
                See who has the most rewards and is leading the community.
              </p>
            </a>
          </Link>

          <Link href="/chat" legacyBehavior>
            <a className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-primary-focus focus:text-primary-focus">
              <h3 className="text-2xl font-bold">Chat &rarr;</h3>
              <p className="mt-4 text-xl">
                Engage in secure, decentralized chat with other verified members.
              </p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
