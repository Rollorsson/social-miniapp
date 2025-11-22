"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Client } from "@xmtp/xmtp-js";
import { useWalletClient } from "wagmi";

export const XmtpChat = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [xmtp, setXmtp] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [peerAddress, setPeerAddress] = useState("");
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    const initXmtp = async () => {
      if (walletClient && !xmtp) {
        try {
          const xmtpClient = await Client.create(walletClient, { env: "dev" });
          setXmtp(xmtpClient);
        } catch (e) {
          console.error(e);
        }
      }
    };
    initXmtp();
  }, [walletClient, xmtp]);

  const startConversation = async () => {
    if (xmtp && peerAddress) {
      try {
        const newConversation = await xmtp.conversations.newConversation(peerAddress);
        setConversation(newConversation);
        const messages = await newConversation.messages();
        setMessages(messages);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const sendMessage = async () => {
    if (conversation) {
      await conversation.send(messageText);
      setMessageText("");
    }
  };

  useEffect(() => {
    if (!conversation) return;

    const streamMessages = async () => {
      const stream = await conversation.streamMessages();
      for await (const msg of stream) {
        setMessages(prevMessages => [...prevMessages, msg]);
      }
    };
    streamMessages();
  }, [conversation]);

  if (!address) {
    return <div>Please connect your wallet.</div>;
  }

  if (!xmtp) {
    return <div>Initializing XMTP...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={peerAddress}
          onChange={e => setPeerAddress(e.target.value)}
          placeholder="Peer address"
          className="input input-bordered w-full max-w-xs"
        />
        <button onClick={startConversation} className="btn btn-primary ml-2">
          Start Chat
        </button>
      </div>
      {conversation && (
        <div>
          <div className="chat-container border rounded-lg p-4 h-96 overflow-y-auto mb-4">
            {messages.map(msg => (
              <div key={msg.id} className={`chat ${msg.senderAddress === address ? "chat-end" : "chat-start"}`}>
                <div className="chat-bubble">
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder="Type a message"
              className="input input-bordered w-full"
              onKeyPress={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="btn btn-primary ml-2">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
