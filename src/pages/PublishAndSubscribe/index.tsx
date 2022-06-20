import AgoraRTC, { IMicrophoneAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '../../config';

const PublishAndSubscribe = () => {
  const [auth, setAuth] = useState(false);
  const [cameraTrack, setCameraTrack] = useState<ILocalVideoTrack>();
  const [microphoneTrack, setMicrophoneTrack] = useState<IMicrophoneAudioTrack>();

  const [cameraState, setCamerState] = useState(false);
  const [audioState, setAudioState] = useState(false);

  const localContainer = useRef<HTMLDivElement>(null);

  const client = AgoraRTC.createClient({
    codec: 'vp8',
    mode: 'rtc',
  });

  const { APP_ID, CHANNEL, TOKEN } = config;

  useEffect(() => {
    if (cameraTrack) console.log('@ cameraTrack updated', cameraTrack);
  }, [cameraTrack]);

  useEffect(() => {
    if (microphoneTrack) console.log('@ microphoneTrack updated', microphoneTrack);
  }, [microphoneTrack]);

  const join = async () => {
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', () => {
      console.log('@ user-unpublished updated');
    });

    await client
      .join(APP_ID, CHANNEL, TOKEN, '0328')
      .then((res) => console.log('@ join: ', res))
      .then(() => makeLocalTrack())
      .catch((err) => console.log('@ err in join: ', err));

    await console.log('@ microphoneTrack, cameraTrack', microphoneTrack, cameraTrack);

    if (microphoneTrack)
      await client.publish(microphoneTrack).then(() => console.log('@ microphoneTrack publish'));

    if (cameraTrack)
      await client.publish(cameraTrack).then(() => console.log('@ cameraTrack publish'));
  };

  const leave = useCallback(async () => {
    if (cameraTrack) {
      cameraTrack.stop();
      cameraTrack.close();
    }

    if (microphoneTrack) {
      microphoneTrack.stop();
      microphoneTrack.close();
    }

    await client
      .leave()
      .then(() => setAuth(false))
      .then(() => console.log('@ leave'))
      .catch((err) => console.log('@ err in leave: ', err));
  }, [cameraTrack, microphoneTrack, client]);

  const makeLocalTrack = async () => {
    console.log('@ call make local ');
    await AgoraRTC.createCameraVideoTrack()
      .then((res: ILocalVideoTrack) => setCameraTrack(res))
      .then(() => console.log('@ setCameraTrack done'));
    await AgoraRTC.createMicrophoneAudioTrack()
      .then((res: IMicrophoneAudioTrack) => setMicrophoneTrack(res))
      .then(() => console.log('@ setMicrophoneTrack done'));
    await setAuth(true);
  };

  //   const publishClient = async (params: ILocalVideoTrack | IMicrophoneAudioTrack) => {
  //     await client
  //       .publish(params)
  //       .then((res) => console.log(`@ publish ${params}:`, res))
  //       .catch((err) => console.log('@ error in publishClient:', err));
  //   };

  //   const unPublishClient = async (params: ILocalVideoTrack | IMicrophoneAudioTrack | null) => {
  //     if (params)
  //       await client
  //         .unpublish(params)
  //         .then((res) => console.log('@ unpublish', res))
  //         .catch((err) => console.log('@ error in unPublishClient:', err));
  //     else
  //       await client
  //         .unpublish()
  //         .then((res) => console.log('@ unpublish', res))
  //         .catch((err) => console.log('@ error in unPublishClient:', err));
  //   };

  const handleUserPublished = async (user: any, mediaType: any) => {
    console.log('@ handleUserPublished');

    await client
      .subscribe(user, mediaType)
      .then((res) => console.log(`@ subscribe`, res))
      .catch((err) => console.log(`@ error in subscribe`, err));
  };

  const cameraToggle = useCallback(() => {
    if (cameraState) {
      cameraTrack?.stop();
      return setCamerState(false);
    }

    if (!localContainer.current) return;

    cameraTrack?.play(localContainer.current);
    setCamerState(true);
  }, [cameraState, cameraTrack]);

  const audioToggle = useCallback(() => {
    if (audioState) {
      microphoneTrack?.stop();
      return setAudioState(false);
    }

    microphoneTrack?.play();
    setAudioState(true);
  }, [audioState, microphoneTrack]);

  return (
    <div>
      <h3>Publish and subscribe</h3>

      <button onClick={join}>join</button>
      <button onClick={leave}>leave</button>

      {auth && cameraTrack && microphoneTrack && (
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
