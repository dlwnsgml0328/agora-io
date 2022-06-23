import { IRemoteAudioTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import { useEffect, useRef } from 'react';
import * as S from './index.styles';

export interface IRemoteMediaPlayerProps {
  videoTrack: IRemoteVideoTrack | undefined;
  audioTrack: IRemoteAudioTrack | undefined;
}
const RemoteMediaPlayer = ({ videoTrack, audioTrack }: IRemoteMediaPlayerProps) => {
  const container = useRef<HTMLDivElement>(null);

  // video 설정
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
    </S.RemoteMediaPlayerWrap>
  );
};

export default RemoteMediaPlayer;
