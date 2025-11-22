"use client";

import { XmtpChat } from "~~/components/bubble/XmtpChat";

const MessagingPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Secure Messaging</h1>
      <XmtpChat />
    </div>
  );
};

export default MessagingPage;
