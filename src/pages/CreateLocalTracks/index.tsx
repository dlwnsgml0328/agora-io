import AgoraRTC, { IMicrophoneAudioTrack, ICameraVideoTrack } from 'agora-rtc-sdk-ng';
import { useEffect, useState } from 'react';
import { config } from '../../config';

const CreateLocalTracks = () => {
  const [auth, setAuth] = useState(false);
  const [cameraTrack, setCameraTrack] = useState<ICameraVideoTrack>();
  const [microphoneTrack, setMicrophoneTrack] = useState<IMicrophoneAudioTrack>();

  useEffect(() => {
    if (cameraTrack && microphoneTrack)
      console.log('@ localTracks updated', cameraTrack, microphoneTrack);
  }, [cameraTrack, microphoneTrack]);

  const client = AgoraRTC.createClient({
    codec: 'vp8',
    mode: 'rtc',
  });

  const { APP_ID, CHANNEL, TOKEN } = config;

  const join = async () => {
    await client
      .join(APP_ID, CHANNEL, TOKEN)
      .then(() => makeLocal())
      .catch((err) => console.log('@ err in join: ', err));
  };

  const leave = () => {
    client.leave();
    setAuth(false);
    console.log('@ leave');
  };

  const makeLocal = async () => {
    const video = AgoraRTC.createCameraVideoTrack().then((res: ICameraVideoTrack) =>
      setCameraTrack(res)
    );
    const audio = AgoraRTC.createMicrophoneAudioTrack().then((res: IMicrophoneAudioTrack) =>
      setMicrophoneTrack(res)
    );

    Promise.all([video, audio])
      .then(() => setAuth(true))
      .catch((err) => console.log('@ err in promise', err));
  };

  return (
    <div>
      <h3>Create local tracks</h3>

      <button onClick={join}>join</button>
      <button onClick={leave}>leave</button>

      {auth && (
        <>
          <button onClick={() => alert('screen share!')}>screen share</button>
          <button onClick={() => cameraTrack!.setEnabled(false)}>camera off</button>
          <button onClick={() => microphoneTrack!.setEnabled(false)}>audio off</button>
        </>
      )}
    </div>
  );
};

export default CreateLocalTracks;

// setEnabled method was deprecated

// https://docs.agora.io/en/Interactive%20Broadcast/create_local_track_web_ng?platform=Web
