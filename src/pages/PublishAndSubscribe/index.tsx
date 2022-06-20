import AgoraRTC, {
  ILocalVideoTrack,
  ILocalAudioTrack,
  IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng';
import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '../../config';

const PublishAndSubscribe = () => {
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

  useEffect(() => {
    if (localVideoTrack) console.log('@ localVideoTrack updated', localVideoTrack);
  }, [localVideoTrack]);

  useEffect(() => {
    if (localAudioTrack) console.log('@ localAudioTrack updated', localAudioTrack);
  }, [localAudioTrack]);

  const handleUserPublished = useCallback(
    async (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
      console.log('@ handleUserPublished');

      await client
        .subscribe(user, mediaType)
        .then((res) => console.log(`@ subscribe`, res))
        .catch((err) => console.log(`@ error in subscribe`, err));
    },
    [client]
  );

  const join = useCallback(async () => {
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', () => {
      console.log('# user-unpublished updated');
    });
    client.on('user-joined', () => console.log('# user joined'));
    client.on('user-left', () => console.log('# user left'));
    client.on('connection-state-change', () => console.log('# connection state changed'));

    await client
      .join(APP_ID, CHANNEL, TOKEN, '0328')
      .then((res) => console.log('@ join: ', res))
      .then(() => makeLocalTrack())
      .catch((err) => console.log('@ err in join: ', err));
  }, [APP_ID, CHANNEL, TOKEN, client, handleUserPublished]);

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
    console.log('@ call make local ');
    await AgoraRTC.createCameraVideoTrack()
      .then((res: ILocalVideoTrack) => setLocalVideoTrack(res))
      .then(() => console.log('@ setLocalVideoTrack done'));
    await AgoraRTC.createMicrophoneAudioTrack()
      .then((res: ILocalAudioTrack) => setLocalAudioTrack(res))
      .then(() => console.log('@ setLocalAudioTrack done'));
    await setAuth(true);
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

  return (
    <div>
      <h3>Publish and subscribe</h3>

      <button onClick={join}>join</button>
      <button onClick={leave}>leave</button>

      {auth && localVideoTrack && localAudioTrack && (
        <>
          <h3>Hello User!</h3>

          <button onClick={cameraToggle}>{cameraState ? 'camera off' : 'camera on'}</button>
          <button onClick={audioToggle}>{audioState ? 'audio off' : 'audio on'} </button>
        </>
      )}

      <div ref={localContainer} className='video-player' style={{ width: 320, height: 240 }}></div>
    </div>
  );
};

export default PublishAndSubscribe;

// https://docs.agora.io/en/Interactive%20Broadcast/join_and_leave_web_ng?platform=Web

/**
 * call join
 * 1. client.on("user-publish", callback) >>> subscribe
 * 2. client.join
 * 3. createMicrophoneAudioTrack
 * 4. createCameraVideoTrack
 */

/**
 * 현재는
 * 1. client.join
 * 2. createMicrophoneAudioTrack
 * 3. createCameraVideoTrack
 * 4. client.on >>> subscribe
 */

// subscribe method를 join method 보다 먼저 호출해야 문제가 생기지 않을 것 같다
