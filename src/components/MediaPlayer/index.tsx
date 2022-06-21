import {
  ILocalVideoTrack,
  IRemoteVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng';
import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface VideoPlayerProps {
  localVideoTrack?: ILocalVideoTrack | undefined;
  localAudioTrack?: ILocalAudioTrack | undefined;

  remoteVideoTrack?: IRemoteVideoTrack | undefined;
  remoteAudioTrack?: IRemoteAudioTrack | undefined;
}

const MediaPlayer = (props: VideoPlayerProps) => {
  const [localState, setLocalState] = useState({
    videoOn: true,
    audioOn: true,
  });

  const container = useRef<HTMLVideoElement>(null);

  // local video 설정
  useEffect(() => {
    if (!container.current) return;
    props.localVideoTrack?.play(container.current);
    return () => {
      props.localVideoTrack?.stop();
    };
  }, [container, props.localVideoTrack]);

  // remote video 설정
  useEffect(() => {
    if (!container.current) return;
    props.remoteVideoTrack?.play(container.current);
    return () => {
      props.remoteVideoTrack?.stop();
    };
  }, [container, props.remoteVideoTrack]);

  // local audio 설정
  useEffect(() => {
    if (props.localAudioTrack) {
      props.localAudioTrack?.play();
    }
    return () => {
      props.localAudioTrack?.stop();
    };
  }, [props.localAudioTrack]);

  // remote audio 설정
  useEffect(() => {
    if (props.remoteAudioTrack) {
      props.remoteAudioTrack?.play();
    }
    return () => {
      props.remoteAudioTrack?.stop();
    };
  }, [props.remoteAudioTrack]);

  // video 버튼
  const cameraToggle = useCallback(async () => {
    if (localState.videoOn) {
      props.localVideoTrack?.stop();
      return setLocalState({ ...localState, videoOn: false });
    }

    if (!container.current) return;

    props.localVideoTrack?.play(container.current);
    setLocalState({ ...localState, videoOn: true });
  }, [localState, props.localVideoTrack]);

  // audio 버튼
  const audioToggle = useCallback(async () => {
    if (localState.audioOn) {
      props.localAudioTrack?.stop();
      return setLocalState({ ...localState, audioOn: false });
    }

    props.localAudioTrack?.play();
    props.localAudioTrack?.setVolume(50);
    setLocalState({ ...localState, audioOn: true });
  }, [localState, props.localAudioTrack]);

  return (
    <>
      <video
        ref={container}
        className='video-player'
        style={{ width: '320px', height: '240px', background: '#000' }}
      ></video>
      {props.localAudioTrack && (
        <>
          <button type='button' onClick={cameraToggle}>
            {props.localVideoTrack && localState.videoOn ? 'video off' : 'video on'}
          </button>
          <button type='button' onClick={audioToggle}>
            {props.localAudioTrack && localState.audioOn ? 'audio off' : 'audio on'}
          </button>
        </>
      )}
    </>
  );
};

export default MediaPlayer;
