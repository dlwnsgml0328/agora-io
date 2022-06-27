import { RtmClient, RtmStatusCode } from 'agora-rtm-sdk';
import { useEffect, useState } from 'react';

const useRTMClient = (client: RtmClient | undefined) => {
  const [connectionState, setConnectionState] = useState({ newState: '', reason: '' });

  useEffect(() => {
    if (!client) return;

    const connectionStateChanged = (
      newState: RtmStatusCode.ConnectionState,
      reason: RtmStatusCode.ConnectionChangeReason
    ) => {
      setConnectionState({ newState: newState, reason: reason });
    };
    client.on('ConnectionStateChanged', connectionStateChanged);

    return () => {
      client.off('ConnectionStateChanged', connectionStateChanged);
    };
  }, [client]);

  return { connectionState };
};

export default useRTMClient;
