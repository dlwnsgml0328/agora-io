import AgoraRTM, { RtmStatusCode } from 'agora-rtm-sdk';
import React, { useCallback, useEffect, useState } from 'react';

const APP_ID = process.env.REACT_APP_RTM_ID;
const client = AgoraRTM.createInstance(APP_ID);
const channel = client.createChannel('test_eazel');

const RTMQuickStart = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [config, setConfig] = useState({ uid: '', token: '' });

  const setCurrentUser = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
    if (e.target.value === 'A') {
      setConfig({ uid: '1796', token: process.env.REACT_APP_USER_A });
    } else {
      setConfig({ uid: '0328', token: process.env.REACT_APP_USER_B });
    }
  }, []);

  const onSubmit = async () => {
    await client
      .login(config)
      .then(() => console.log('@ login successfully'))
      .then(() => setAuth(true))
      .catch((err) => console.error('error occurred in login callback', err));
  };

  const onLogOut = async () => {
    await client
      .logout()
      .then(() => console.log('@ logout completed'))
      .then(() => setAuth(false))
      .catch((err) => console.error('error occurred in logout callback', err));
  };

  const onEnter = async () => {
    await channel.join().then(() => {
      console.log('@ channel join successfully');
    });
  };

  const onLeave = async () => {
    if (channel !== null) {
      await channel.leave().then(() => {
        console.log('@ channel leave successfully');
      });
    } else {
      console.log('Channel is empty');
    }
  };

  // client event check
  useEffect(() => {
    const connectionStateChanged = (
      newState: RtmStatusCode.ConnectionState,
      reason: RtmStatusCode.ConnectionChangeReason
    ) => {
      console.log('newState:', newState, '\nreason:', reason);
    };
    client.on('ConnectionStateChanged', connectionStateChanged);

    return () => {
      client.off('ConnectionStateChanged', connectionStateChanged);
    };
  }, []);

  // channel event check
  useEffect(() => {
    const memberJoined = (id: string) => console.log('memberJoined', id);
    channel.on('MemberJoined', memberJoined);

    return () => {
      channel.off('MemberJoined', memberJoined);
    };
  }, []);

  return (
    <>
      {!auth ? (
        <div onChange={setCurrentUser}>
          <h3>Select User</h3>

          <label>
            <input type='radio' name='user' value='A' />
            <span>A</span>
          </label>
          <label>
            <input type='radio' name='user' value='B' />
            <span>B</span>
          </label>

          <button disabled={!user} type='button' onClick={onSubmit}>
            로그인
          </button>
        </div>
      ) : (
        <div>
          <h3>Join</h3>

          <div id='userName'></div>
          <button type='button' onClick={onLogOut}>
            로그아웃
          </button>
          <button type='button' onClick={onEnter}>
            enter
          </button>
          <button type='button' onClick={onLeave}>
            leave
          </button>
        </div>
      )}
    </>
  );
};

export default RTMQuickStart;
