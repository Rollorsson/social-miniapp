"use client";

import { useState, useEffect, useRef } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useXMTP } from "~~/hooks/useXMTP";
import { Address } from "~~/components/scaffold-eth";

const Chat: NextPage = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { messages, loadConversation, sendMessage } = useXMTP();
  const { address: connectedAddress } = useAccount();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: verifiedUsers, isLoading: isLoadingUsers } = useScaffoldReadContract({
    contractName: "ChallengeRewards",
    functionName: "getVerifiedUsers",
  });

  useEffect(() => {
    if (selectedUser) {
      loadConversation(selectedUser);
    }
  }, [selectedUser, loadConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }
    setIsSending(true);
    try {
      await sendMessage(message);
      setMessage("");
      toast.success("Message sent!");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)]">
      {/* User List */}
      <div className="w-1/3 bg-base-200 p-4 overflow-y-auto border-r border-base-300">
        <h2 className="text-2xl font-bold mb-4 text-neutral-content">Verified Users</h2>
        {isLoadingUsers ? (
          <div className="text-center py-4">
            <span className="loading loading-spinner"></span>
          </div>
        ) : (
          <ul>
            {verifiedUsers
              ?.filter((user: string) => user !== connectedAddress) // Don't show self in list
              .map((user: string) => (
                <li
                  key={user}
                  className={`p-3 cursor-pointer rounded-lg truncate ${
                    selectedUser === user ? "bg-primary text-primary-content" : "hover:bg-base-300"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <Address address={user} />
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Chat Window */}
      <div className="w-2/3 flex flex-col bg-base-100">
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedUser ? (
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b border-base-300 pb-2">
                Chat with <Address address={selectedUser} />
              </h2>
              <div className="space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`chat ${msg.senderAddress === connectedAddress ? "chat-end" : "chat-start"}`}
                  >
                    <div
                      className={`chat-bubble ${
                        msg.senderAddress === connectedAddress ? "chat-bubble-primary" : "chat-bubble-secondary"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-neutral-content text-xl">Select a user to start chatting</p>
            </div>
          )}
        </div>
        {selectedUser && (
          <div className="p-4 bg-base-200 border-t border-base-300">
            <div className="flex">
              <input
                type="text"
                className="input input-bordered w-full mr-2"
                placeholder="Type a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={e => e.key === "Enter" && handleSendMessage()}
                disabled={isSending}
              />
              <button className="btn btn-primary" onClick={handleSendMessage} disabled={isSending}>
                {isSending ? <span className="loading loading-spinner"></span> : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
