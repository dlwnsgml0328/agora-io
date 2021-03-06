import AgoraRTC, {
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from 'agora-rtc-sdk-ng';
import { useState } from 'react';
import Communication from '../../components/Communication';
import Login from '../../components/Login';

const CreateRemoteTracks = () => {
  const [auth, setAuth] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser | undefined>();

  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack>();
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack>();

  const client = AgoraRTC.createClient({
    codec: 'vp8',
    mode: 'rtc',
  });

  return (
    <div>
      <h3>Create Remote Tracks</h3>

      {!auth ? (
        <Login
          client={client}
          setAuth={setAuth}
          setLocalVideoTrack={setLocalVideoTrack}
          setLocalAudioTrack={setLocalAudioTrack}
          remoteUsers={remoteUsers}
          setRemoteUsers={setRemoteUsers}
        />
      ) : (
        <Communication
          AgoraRTC={AgoraRTC}
          client={client}
          setAuth={setAuth}
          localVideoTrack={localVideoTrack}
          localAudioTrack={localAudioTrack}
          setLocalVideoTrack={setLocalVideoTrack}
          setLocalAudioTrack={setLocalAudioTrack}
        />
      )}
    </div>
  );
};

export default CreateRemoteTracks;
