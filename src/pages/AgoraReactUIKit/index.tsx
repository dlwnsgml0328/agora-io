import { useState } from 'react';
import AgoraUIKit from 'agora-react-uikit';

const AgoraReactUIKit = () => {
  const [videoCall, setVideoCall] = useState(true);
  const rtcProps = {
    appId: process.env.REACT_APP_APP_ID,
    channel: process.env.REACT_APP_CHANNEL, // your agora channel
    token: process.env.REACT_APP_TOKEN, // use null or skip if using app in testing mode
  };
  const callbacks = {
    EndCall: () => setVideoCall(false),
  };
  return videoCall ? (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
    </div>
  ) : (
    <h3 onClick={() => setVideoCall(true)}>Start Call</h3>
  );
};

export default AgoraReactUIKit;
