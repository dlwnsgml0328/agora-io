import {
  ILocalVideoTrack,
  IRemoteVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng';
import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
}

const MediaPlayer = (props: VideoPlayerProps) => {
  const [localState, setLocalState] = useState({
    videoOn: true,
    audioOn: true,
  });

  const container = useRef<HTMLDivElement>(null);

  // video 설정
  useEffect(() => {
    if (!container.current) return;
    props.videoTrack?.play(container.current);
    return () => {
      props.videoTrack?.stop();
    };
  }, [container, props.videoTrack]);

  // audio 설정
  useEffect(() => {
    if (props.audioTrack) {
      props.audioTrack?.play();
    }
    return () => {
      props.audioTrack?.stop();
    };
  }, [props.audioTrack]);

  // video 버튼
  const cameraToggle = useCallback(async () => {
    if (localState.videoOn) {
      props.videoTrack?.stop();
      return setLocalState({ ...localState, videoOn: false });
    }

    if (!container.current) return;

    props.videoTrack?.play(container.current);
    setLocalState({ ...localState, videoOn: true });
  }, [localState, props.videoTrack]);

  // audio 버튼
  const audioToggle = useCallback(async () => {
    if (localState.audioOn) {
      props.audioTrack?.stop();
      return setLocalState({ ...localState, audioOn: false });
    }

    props.audioTrack?.play();
    setLocalState({ ...localState, audioOn: true });
  }, [localState, props.audioTrack]);

  return (
    <>
      <div
        ref={container}
        className='video-player'
        style={{ width: '320px', height: '240px', background: '#000' }}
      ></div>
      <button type='button' onClick={cameraToggle}>
        {localState.videoOn ? 'video off' : 'video on'}
      </button>
      <button type='button' onClick={audioToggle}>
        {localState.audioOn ? 'audio off' : 'audio on'}
      </button>
    </>
  );
};

export default MediaPlayer;
