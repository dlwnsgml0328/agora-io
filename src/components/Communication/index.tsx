import { IAgoraRTC, IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './index.styles';

interface IProps {
  AgoraRTC: IAgoraRTC;
  client: IAgoraRTCClient;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  localVideoTrack: ILocalVideoTrack | undefined;
  localAudioTrack: ILocalAudioTrack | undefined;
  setLocalVideoTrack: React.Dispatch<React.SetStateAction<ILocalVideoTrack | undefined>>;
  setLocalAudioTrack: React.Dispatch<React.SetStateAction<ILocalAudioTrack | undefined>>;
}

const Communication = ({
  AgoraRTC,
  client,
  setAuth,
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

  const leave = useCallback(async () => {
    await client
      .leave()
      .then(() => setAuth(false))
      .catch((err) => console.error('error occurred in leave method', err));
  }, [client, setAuth]);

  const cameraToggle = useCallback(async () => {
    if (localState.videoOn) {
      localVideoTrack?.stop();
      return setLocalState({ ...localState, videoOn: false });
    }

    if (!localContainer.current) return;

    localVideoTrack?.play(localContainer.current);
    setLocalState({ ...localState, videoOn: true });

    // if (localVideoTrack) {
    //   await client
    //     .publish(localVideoTrack)
    //     .then(() => console.log('@ video publish success'))
    //     .catch((err) => console.error('error occurred in video toggle method', err));
    // }
  }, [localState, localVideoTrack]);

  const audioToggle = useCallback(async () => {
    if (localState.audioOn) {
      localAudioTrack?.stop();
      return setLocalState({ ...localState, audioOn: false });
    }

    localAudioTrack?.play();
    setLocalState({ ...localState, audioOn: true });

    // if (localAudioTrack) {
    //   await client
    //     .publish(localAudioTrack)
    //     .then(() => console.log('@ audio publish success'))
    //     .catch((err) => console.error('error occurred in audio toggle method', err));
    // }
  }, [localState, localAudioTrack]);

  return (
    <S.CommunicationWrap>
      <h3>Communication</h3>

      <button type='button' onClick={leave}>
        leave
      </button>

      <button type='button' onClick={cameraToggle}>
        {localState.videoOn ? 'video off' : 'video on'}
      </button>
      <button type='button' onClick={audioToggle}>
        {localState.audioOn ? 'audio off' : 'audio on'}
      </button>

      <div ref={localContainer} style={{ width: 320, height: 240 }} />
    </S.CommunicationWrap>
  );
};

export default Communication;
