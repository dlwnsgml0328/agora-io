import { RemoteInvitation, RtmClient, RtmMessage, RtmStatusCode } from 'agora-rtm-sdk';
import { useEffect, useState } from 'react';

interface ReceivedMessageProperties {
  serverReceivedTs: number;
  isOfflineMessage: boolean;
}

const useRTMClient = (client: RtmClient | undefined) => {
  const [connectionState, setConnectionState] = useState({ newState: '', reason: '' });
  const [receivedInvitation, setReceivedInvitation] = useState<RemoteInvitation>();

  useEffect(() => {
    if (!client) return;

    const connectionStateChanged = (
      newState: RtmStatusCode.ConnectionState,
      reason: RtmStatusCode.ConnectionChangeReason
    ) => {
      if (newState === 'ABORTED') {
        alert('동시에 로그인 되었습니다. 유저 정보를 확인해주세요');
      }
      setConnectionState({ newState: newState, reason: reason });
    };

    const messageFromPeer = (
      message: RtmMessage,
      peerId: string,
      messageProps: ReceivedMessageProperties
    ) => {
      if (message.messageType === 'TEXT') {
        console.log(
          `message: ${message.text}\npeerId: ${peerId}\nmessageProps: ${
            (messageProps.serverReceivedTs, messageProps.isOfflineMessage)
          }`
        );
      }
    };

    const remoteInvitationReceived = (remoteInvitation: RemoteInvitation) => {
      setReceivedInvitation(remoteInvitation);
    };

    client.on('ConnectionStateChanged', connectionStateChanged);
    client.on('MessageFromPeer', messageFromPeer);
    client.on('RemoteInvitationReceived', remoteInvitationReceived);

    return () => {
      client.off('ConnectionStateChanged', connectionStateChanged);
      client.off('MessageFromPeer', messageFromPeer);
      client.off('RemoteInvitationReceived', remoteInvitationReceived);
    };
  }, [client]);

  return { connectionState, receivedInvitation };
};

export default useRTMClient;
