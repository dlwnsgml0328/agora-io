import AgoraRTC from 'agora-rtc-sdk-ng';
import { useState } from 'react';
import Login from '../../components/Login';

const CreateRemoteTracks = () => {
  const [auth, setAuth] = useState(false);

  const client = AgoraRTC.createClient({
    codec: 'vp8',
    mode: 'rtc',
  });

  return (
    <div>
      <h3>Create Remote Tracks</h3>

      {!auth ? <Login client={client} setAuth={setAuth} /> : <div>Welcome!</div>}
    </div>
  );
};

export default CreateRemoteTracks;
