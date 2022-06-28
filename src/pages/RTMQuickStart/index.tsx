import AgoraRTM from 'agora-rtm-sdk';
import { useEffect, useState } from 'react';
import useRTMChannel from '../../hooks/userRTMChannel';
import useRTMClient from '../../hooks/useRTMClient';

import * as S from './index.styles';

const APP_ID = process.env.REACT_APP_RTM_ID;
const client = AgoraRTM.createInstance(APP_ID);
const channel = client.createChannel('test_eazel');

const USER_A = {
  uid: '1796',
  token: process.env.REACT_APP_USER_A,
};

const USER_B = {
  uid: '0328',
  token: process.env.REACT_APP_USER_B,
};

const USER_C = {
  uid: '9170',
  token: process.env.REACT_APP_USER_C,
};

const RTMQuickStart = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [config, setConfig] = useState({ uid: '', token: '' });
  const [isChannel, setIsChannel] = useState(false);

  const [msgInput, setMsgInput] = useState('');

  const { connectionState } = useRTMClient(client);
  const { channelState } = useRTMChannel(channel);

  useEffect(() => {
    if (connectionState.newState) {
      console.log('@ connectionStateChanged', connectionState);
    }
  }, [connectionState]);

  useEffect(() => {
    if (channelState) console.log('@ channelState updated:', channelState);
  }, [channelState]);

  const setCurrentUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
    if (e.target.value === 'A') {
      setConfig(USER_A);
    } else if (e.target.value === 'B') {
      setConfig(USER_B);
    } else {
      setConfig(USER_C);
    }
  };

  const onLogin = async () => {
    await client
      .login(config)
      .then(() => console.log('@ login successfully'))
      .then(() => setAuth(true))
      .catch((err) => console.error('error occurred in login callback', err));
  };

  const onLogOut = async () => {
    if (channel && isChannel)
      await channel
        .leave()
        .then(() => setIsChannel(false))
        .catch((err) => console.error('error occurred in leave callback', err));
    await client
      .logout()
      .then(() => console.log('@ logout completed'))
      .then(() => setAuth(false))
      .catch((err) => console.error('error occurred in logout callback', err));
  };

  const onEnter = async () => {
    await channel
      .join()
      .then(() => {
        console.log('@ channel join successfully');
      })
      .then(() => {
        setIsChannel(true);
      });
  };

  const onLeave = async () => {
    if (channel !== null) {
      await channel
        .leave()
        .then(() => {
          console.log('@ channel leave successfully');
        })
        .then(() => {
          setIsChannel(false);
        });
    } else {
      console.log('Channel is empty');
    }
  };

  const onSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (msgInput.length === 0) {
      alert('Invalid value');
      return;
    }

    await channel
      .sendMessage({ text: msgInput })
      .then(() => {
        AddText(msgInput);
        setMsgInput('');
      })
      .catch((err) => console.error('error occurred in sending message', err));
  };

  const AddText = (msg: string) => {
    const textArea = document.querySelector('.conversation');

    const text = document.createElement('div');
    text.className = 'local';
    text.innerHTML = `<span class="uid">🌝</span><span class="msg">${msg}</span>`;

    if (textArea) textArea.append(text);
  };

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
          <label>
            <input type='radio' name='user' value='C' />
            <span>C</span>
          </label>

          <button disabled={!user} type='button' onClick={onLogin}>
            로그인
          </button>
        </div>
      ) : (
        <div>
          <h3>Join</h3>

          <div id='userName'>
            <h3>Hello, {config.uid}</h3>
          </div>
          <button type='button' onClick={onLogOut}>
            로그아웃
          </button>
          {!isChannel ? (
            <button type='button' onClick={onEnter}>
              enter
            </button>
          ) : (
            <button type='button' onClick={onLeave}>
              leave
            </button>
          )}

          {isChannel && (
            <S.MessageWrap>
              <ul>
                <li>In channel: {channel.channelId}</li>
              </ul>

              <div className='conversation'></div>

              <form className='form-wrap' onSubmit={onSend}>
                <input type='text' value={msgInput} onChange={(e) => setMsgInput(e.target.value)} />
                <button type='submit'>전송</button>
              </form>
            </S.MessageWrap>
          )}
        </div>
      )}
    </>
  );
};

export default RTMQuickStart;
