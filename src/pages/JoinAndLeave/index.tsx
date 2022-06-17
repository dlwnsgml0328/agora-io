import AgoraRTC from 'agora-rtc-sdk-ng';
import { config } from '../../config';

const JoinAndLeave = () => {
  const client = AgoraRTC.createClient({
    codec: 'vp8',
    mode: 'rtc',
  });

  const { APP_ID, CHANNEL, TOKEN } = config;

  const join = async () => {
    await client.join(APP_ID, CHANNEL, TOKEN).then((res) => console.log('@ res: ', res));
  };

  const leave = () => {
    client.leave();
    console.log('@ leave');
  };

  return (
    <div className='App'>
      <h3>Hello Agora</h3>

      <button onClick={join}>join</button>
      <button onClick={leave}>leave</button>
    </div>
  );
};

export default JoinAndLeave;
