import { RtmChannel } from 'agora-rtm-sdk';
import { useEffect, useState } from 'react';

interface IChannelState {
  id: string;
  msg: string;
}

const useRTMChannel = (channel: RtmChannel) => {
  const [channelState, setChannelState] = useState<IChannelState>({ id: '', msg: '' });
  useEffect(() => {
    if (!channel) return;
    const memberJoined = (id: string) => setChannelState({ id: id, msg: 'memberJoined' });
    const memberLeft = (id: string) => setChannelState({ id: id, msg: 'memberLeft' });

    channel.on('MemberJoined', memberJoined);
    channel.on('MemberLeft', memberLeft);

    return () => {
      channel.off('MemberJoined', memberJoined);
      channel.off('MemberLeft', memberLeft);
    };
  }, [channel]);

  return { channelState };
};

export default useRTMChannel;
