import AgoraRTC, { IMicrophoneAudioTrack, ICameraVideoTrack } from 'agora-rtc-sdk-ng';
import { useEffect, useState } from 'react';
import { config } from '../../config';

const PublishAndSubscribe = () => {
  const [auth, setAuth] = useState(false);
  const [cameraTrack, setCameraTrack] = useState<ICameraVideoTrack>();
  const [microphoneTrack, setMicrophoneTrack] = useState<IMicrophoneAudioTrack>();

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
    await client
      .join(APP_ID, CHANNEL, TOKEN, '0328')
      .then((res) => console.log('@ join: ', res))
      .then(() => makeLocalTrack())
      .catch((err) => console.log('@ err in join: ', err));
  };

  const leave = async () => {
    await client
      .leave()
      .then(() => setAuth(false))
      .then(() => console.log('@ leave'))
      .catch((err) => console.log('@ err in leave: ', err));
  };

  const makeLocalTrack = async () => {
    console.log('@ call make local ');
    await AgoraRTC.createCameraVideoTrack()
      .then((res: ICameraVideoTrack) => setCameraTrack(res))
      .then(() => console.log('@ setCameraTrack done'));
    await AgoraRTC.createMicrophoneAudioTrack()
      .then((res: IMicrophoneAudioTrack) => setMicrophoneTrack(res))
      .then(() => console.log('@ setMicrophoneTrack done'));
    await setAuth(true);
  };

  const publishClient = async (params: ICameraVideoTrack | IMicrophoneAudioTrack) => {
    await client
      .publish(params)
      .then((res) => console.log(`@ publish ${params}:`, res))
      .catch((err) => console.log('@ error in publishClient:', err));
  };

  const unPublishClient = async (params: ICameraVideoTrack | IMicrophoneAudioTrack | null) => {
    if (params)
      await client
        .unpublish(params)
        .then((res) => console.log('@ unpublish', res))
        .catch((err) => console.log('@ error in unPublishClient:', err));
    else
      await client
        .unpublish()
        .then((res) => console.log('@ unpublish', res))
        .catch((err) => console.log('@ error in unPublishClient:', err));
  };

  return (
    <div>
      <h3>Publish and subscribe</h3>

      <button onClick={join}>join</button>
      <button onClick={leave}>leave</button>

      {auth && cameraTrack && microphoneTrack && (
        <>
          <h3>Hello User!</h3>
          <p>
            <button onClick={() => publishClient(cameraTrack)}>publish video</button>
            <button onClick={() => publishClient(microphoneTrack)}>publish audio</button>
            <button
              onClick={() => unPublishClient(cameraTrack)}
              style={{ color: 'orange', background: '#fff', border: '0.5px solid #000' }}
            >
              unpublish video
            </button>
            <button
              onClick={() => unPublishClient(microphoneTrack)}
              style={{ color: 'orange', background: '#fff', border: '0.5px solid #000' }}
            >
              unpublish audio
            </button>
          </p>
        </>
      )}
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
