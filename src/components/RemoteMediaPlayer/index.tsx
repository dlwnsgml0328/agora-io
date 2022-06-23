import { IRemoteAudioTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import { useEffect, useRef } from 'react';
import * as S from './index.styles';

export interface IRemoteMediaPlayerProps {
  videoTrack: IRemoteVideoTrack | undefined;
  audioTrack: IRemoteAudioTrack | undefined;
}
const RemoteMediaPlayer = ({ videoTrack, audioTrack }: IRemoteMediaPlayerProps) => {
  //   const [remoteState, setRemoteState] = useState({
  //     videOn: true,
  //     audioOn: true,
  //   });

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoTrack) console.log('@ Remote videoTrack 💣', videoTrack.getMediaStreamTrack());
  }, [videoTrack]);

  useEffect(() => {
    if (!container.current) return;

    videoTrack?.play(container.current);

    return () => {
      videoTrack?.stop();
    };
  }, [container, videoTrack]);

  // audio 설정
  useEffect(() => {
    if (audioTrack) {
      audioTrack?.play();
    }
    return () => {
      audioTrack?.stop();
    };
  }, [audioTrack]);

  return (
    <S.RemoteMediaPlayerWrap>
      <div ref={container} className='video-player'></div>

      {/* <button type='button' onClick={audioToggle}>
    {RemoteState.audioOn ? 'audio off' : 'audio on'}
  </button> */}
    </S.RemoteMediaPlayerWrap>
  );
};

export default RemoteMediaPlayer;
