import { ILocalVideoTrack, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
import { useRef, useEffect, useState, useCallback } from 'react';
import * as S from './index.styles';

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | undefined;
  audioTrack: ILocalAudioTrack | undefined;
}

const LocalMediaPlayer = ({ videoTrack, audioTrack }: VideoPlayerProps) => {
  const [localState, setLocalState] = useState({
    videoOn: true,
    audioOn: true,
  });

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

  // video 버튼
  const cameraToggle = useCallback(async () => {
    if (localState.videoOn) {
      videoTrack?.stop();
      videoTrack?.setEnabled(false);
      return setLocalState({ ...localState, videoOn: false });
    }

    if (!container.current) return;

    videoTrack?.play(container.current);
    videoTrack?.setEnabled(true);
    setLocalState({ ...localState, videoOn: true });
  }, [localState, videoTrack]);

  // // audio 버튼
  // const audioToggle = useCallback(async () => {
  //   if (localState.audioOn) {
  //     props.audioTrack?.stop();
  //     return setLocalState({ ...localState, audioOn: false });
  //   }

  //   props.audioTrack?.play();
  //   setLocalState({ ...localState, audioOn: true });
  // }, [localState, props.audioTrack]);

  return (
    <S.LocalMediaPlayerWrap>
      <div ref={container} className='video-player'></div>
      <button type='button' onClick={cameraToggle}>
        {localState.videoOn ? 'video off' : 'video on'}
      </button>
      {/* <button type='button' onClick={audioToggle}>
        {localState.audioOn ? 'audio off' : 'audio on'}
      </button> */}
    </S.LocalMediaPlayerWrap>
  );
};

export default LocalMediaPlayer;
