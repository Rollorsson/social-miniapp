import { useState, useEffect, useRef } from 'react';
import { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js';
import { useEthersSigner } from '~~/hooks/scaffold-eth';

export const useXMTP = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<DecodedMessage[]>([]);
  const convRef = useRef<Conversation | null>(null);
  const signer = useEthersSigner();

  useEffect(() => {
    const initXMTP = async () => {
      if (signer) {
        try {
          const xmtp = await Client.create(signer as any, { env: 'dev' });
          setClient(xmtp);
        } catch (error) {
          console.error('Failed to initialize XMTP client:', error);
        }
      }
    };

    initXMTP();
  }, [signer]);

  const loadConversation = async (recipient: string) => {
    if (!client) {
      console.error('XMTP client not initialized');
      return;
    }
    try {
      const conversation = await client.conversations.newConversation(recipient);
      convRef.current = conversation;
      const existingMessages = await conversation.messages();
      setMessages(existingMessages);

      // Start streaming for new messages
      for await (const message of await conversation.streamMessages()) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!convRef.current) {
      console.error('No conversation selected');
      return;
    }
    try {
      await convRef.current.send(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return { client, messages, loadConversation, sendMessage };
};
