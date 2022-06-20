import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { useCallback, useRef, useState } from 'react';
import { config } from '../../config';

const AdjustVolume = () => {
  const [auth, setAuth] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack>();
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack>();

  const [cameraState, setCamerState] = useState(false);
  const [audioState, setAudioState] = useState(false);

  const localContainer = useRef<HTMLDivElement>(null);

  const client = AgoraRTC.createClient({
    codec: 'vp8',
    mode: 'rtc',
  });

  const { APP_ID, CHANNEL, TOKEN } = config;

  const join = useCallback(async () => {
    await client
      .join(APP_ID, CHANNEL, TOKEN, '0328')
      .then((res) => console.log('@ join: ', res))
      .then(() => makeLocalTrack())
      .catch((err) => console.log('@ err in join: ', err));
  }, [APP_ID, CHANNEL, TOKEN, client]);

  const leave = useCallback(async () => {
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }

    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }

    await client
      .leave()
      .then(() => setAuth(false))
      .then(() => console.log('@ leave'))
      .catch((err) => console.log('@ err in leave: ', err));
  }, [localVideoTrack, localAudioTrack, client]);

  const makeLocalTrack = async () => {
    await AgoraRTC.createCameraVideoTrack().then((res: ILocalVideoTrack) =>
      setLocalVideoTrack(res)
    );
    await AgoraRTC.createMicrophoneAudioTrack().then((res: ILocalAudioTrack) =>
      setLocalAudioTrack(res)
    );
    setAuth(true);
  };

  const cameraToggle = useCallback(async () => {
    if (cameraState) {
      localVideoTrack?.stop();
      return setCamerState(false);
    }

    if (!localContainer.current) return;

    localVideoTrack?.play(localContainer.current);
    setCamerState(true);
  }, [localVideoTrack, cameraState]);

  const audioToggle = useCallback(async () => {
    if (audioState) {
      localAudioTrack?.stop();
      return setAudioState(false);
    }

    localAudioTrack?.play();
    setAudioState(true);
  }, [audioState, localAudioTrack]);

  const volumeHandler = (volume: number) => {
    AgoraRTC.createMicrophoneAudioTrack().then((localAudio: ILocalAudioTrack) => {
      console.log('volume changed: ', volume);
      localAudio.setVolume(volume);
    });
  };

  return (
    <div>
      <h3>Adjust volume</h3>

      <button onClick={join}>join</button>
      <button onClick={leave}>leave</button>

      {auth && localVideoTrack && localAudioTrack && (
        <>
          <h3>Hello User!</h3>

          <button onClick={cameraToggle}>{cameraState ? 'camera off' : 'camera on'}</button>
          <button onClick={audioToggle}>{audioState ? 'audio off' : 'audio on'} </button>

          <audio controls />

          <button onClick={() => volumeHandler(0)}>0%</button>
          <button onClick={() => volumeHandler(50)}>50%</button>
          <button onClick={() => volumeHandler(100)}>100%</button>
        </>
      )}

      <div ref={localContainer} className='video-player' style={{ width: 320, height: 240 }}></div>
    </div>
  );
};

export default AdjustVolume;
