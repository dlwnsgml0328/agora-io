import { IAgoraRTC, IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './index.styles';

interface IProps {
  AgoraRTC: IAgoraRTC;
  client: IAgoraRTCClient;
  localVideoTrack: ILocalVideoTrack | undefined;
  localAudioTrack: ILocalAudioTrack | undefined;
  setLocalVideoTrack: React.Dispatch<React.SetStateAction<ILocalVideoTrack | undefined>>;
  setLocalAudioTrack: React.Dispatch<React.SetStateAction<ILocalAudioTrack | undefined>>;
}

const Communication = ({
  AgoraRTC,
  client,
  localVideoTrack,
  localAudioTrack,
  setLocalVideoTrack,
  setLocalAudioTrack,
}: IProps) => {
  const [localState, setLocalState] = useState({
    videoOn: false,
    audioOn: false,
  });

  const localContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('@ localstate updated', localState);
  }, [localState]);

  const cameraToggle = useCallback(async () => {
    if (localState.videoOn) {
      localVideoTrack?.stop();
      return setLocalState({ ...localState, videoOn: false });
    }

    if (!localContainer.current) return;

    localVideoTrack?.play(localContainer.current);
    setLocalState({ ...localState, videoOn: true });
  }, [localState, localVideoTrack]);

  const audioToggle = useCallback(async () => {
    if (localState.audioOn) {
      localAudioTrack?.stop();
      return setLocalState({ ...localState, audioOn: false });
    }

    localAudioTrack?.play();
    setLocalState({ ...localState, audioOn: true });
  }, [localState, localAudioTrack]);

  return (
    <S.CommunicationWrap>
      <h3>Communication</h3>

      <button onClick={cameraToggle}>{localState.videoOn ? 'video off' : 'video on'}</button>
      <button onClick={audioToggle}>{localState.audioOn ? 'audio off' : 'audio on'}</button>

      <div ref={localContainer} className='video-player' style={{ width: 320, height: 240 }}></div>
    </S.CommunicationWrap>
  );
};

export default Communication;
