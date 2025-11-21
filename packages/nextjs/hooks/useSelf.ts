import { useState, useEffect } from 'react';
import { SelfID } from '@self.id/web';
import { useEthersSigner } from '~~/hooks/scaffold-eth';

export const useSelf = () => {
  const [selfId, setSelfId] = useState<SelfID | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const signer = useEthersSigner();

  useEffect(() => {
    const connect = async () => {
      if (signer) {
        try {
          const self = await SelfID.authenticate({
            // @ts-expect-error: Ethers v6 provider is not supported by SelfID yet
            provider: signer.provider,
            // You can also specify a specific DID for the user
            // did: 'did:key:z6Mkh...
          });
          setSelfId(self);
        } catch (error) {
          console.error('Error authenticating with SelfID:', error);
        }
      }
    };

    connect();
  }, [signer]);

  const verifyWithSelf = async () => {
    if (!selfId) {
      console.error('SelfID not initialized');
      return false;
    }

    try {
      // For the purpose of this hackathon, we'll consider the user "verified"
      // if they can successfully authenticate and we have their DID.
      // In a real-world scenario, you would check for a specific claim or credential.
      const did = selfId.did;
      if (did) {
        console.log('Successfully verified with SelfID. DID:', did.id);
        setIsVerified(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying with SelfID:', error);
      return false;
    }
  };

  return { isVerified, verifyWithSelf, selfId };
};
