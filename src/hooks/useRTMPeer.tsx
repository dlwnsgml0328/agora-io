import { RtmClient, RtmMessage, RtmStatusCode } from 'agora-rtm-sdk';
import { useEffect, useState } from 'react';

interface ReceivedMessageProperties {
  serverReceivedTs: number;
  isOfflineMessage: boolean;
}

const useRTMPeer = (client: RtmClient | undefined) => {
  const [connectionState, setConnectionState] = useState({ newState: '', reason: '' });

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
        AddTextRemote(message.text, peerId);
      }
    };

    const AddTextRemote = (message: string, memberId?: string) => {
      const textArea = document.querySelector('.conversation');

      const text = document.createElement('div');
      text.className = 'remote';
      text.innerHTML = `<span class="uid">🌞</span><span class="msg">${message}</span>`;

      if (textArea) textArea.append(text);
    };

    client.on('ConnectionStateChanged', connectionStateChanged);
    client.on('MessageFromPeer', messageFromPeer);

    return () => {
      client.off('ConnectionStateChanged', connectionStateChanged);
      client.off('MessageFromPeer', messageFromPeer);
    };
  }, [client]);

  return { connectionState };
};

export default useRTMPeer;
