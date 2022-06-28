import { RtmChannel, RtmMessage } from 'agora-rtm-sdk';
import { useEffect, useState } from 'react';

interface IChannelState {
  id: string;
  msg: string;
}

const useRTMChannel = (channel: RtmChannel) => {
  const [channelState, setChannelState] = useState<IChannelState>({ id: '', msg: '' });

  const getMembers = () =>
    channel.getMembers().then((members: string[]) => {
      return members;
    });

  const AddTextRemote = (message: string, memberId?: string) => {
    const textArea = document.querySelector('.conversation');

    const text = document.createElement('div');
    text.className = 'remote';
    text.innerHTML = `<span class="uid">🌞</span><span class="msg">${message}</span>`;

    if (textArea) textArea.append(text);
  };

  useEffect(() => {
    if (!channel) return;
    const memberJoined = (id: string) => setChannelState({ id: id, msg: 'memberJoined' });
    const memberLeft = (id: string) => setChannelState({ id: id, msg: 'memberLeft' });
    const channelMessage = (message: RtmMessage, memberId: string) => {
      console.log('message.messageType: ', message.messageType);
      if (message.messageType === 'TEXT') {
        // console.log(`message: ` + message.text + `\nmemberId: ` + memberId);
        AddTextRemote(message.text, memberId);
      }
    };
    const memberCount = (memberCount: number) => console.log(`memberCount updated: ${memberCount}`);

    channel.on('MemberJoined', memberJoined);
    channel.on('MemberLeft', memberLeft);
    channel.on('ChannelMessage', channelMessage);
    channel.on('MemberCountUpdated', memberCount);

    return () => {
      channel.off('MemberJoined', memberJoined);
      channel.off('MemberLeft', memberLeft);
      channel.off('ChannelMessage', channelMessage);
    };
  }, [channel]);

  return { channelState, getMembers };
};

export default useRTMChannel;

/**
 *  ChannelMessage: (
      message: RtmMessage,
      memberId: string,
      messagePros: ReceivedMessageProperties
    ) => void;
 */
