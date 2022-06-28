import AgoraRTM from 'agora-rtm-sdk';
import { useEffect, useState } from 'react';
import useRTMPeer from '../../hooks/useRTMPeer';
import * as S from '../RTMQuickStart/index.styles';

const APP_ID = process.env.REACT_APP_RTM_ID;
const client = AgoraRTM.createInstance(APP_ID);

const USER_A = {
  uid: '1796',
  token: process.env.REACT_APP_USER_A,
};

const USER_B = {
  uid: '0328',
  token: process.env.REACT_APP_USER_B,
};

const RTMPeerToPeer = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [config, setConfig] = useState({ uid: '', token: '' });
  const [remote, setRemote] = useState('');
  const [onSave, setOnSave] = useState(false);
  const [msgInput, setMsgInput] = useState('');

  const { connectionState } = useRTMPeer(client);

  useEffect(() => {
    if (connectionState.newState) console.log('@ connectionStateChanged', connectionState);
  }, [connectionState]);

  const setCurrentUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
    if (e.target.value === 'A') {
      setConfig(USER_A);
    } else {
      setConfig(USER_B);
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
    await client
      .logout()
      .then(() => console.log('@ logout completed'))
      .then(() => setAuth(false))
      .catch((err) => console.error('error occurred in logout callback', err));
  };

  const onSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (msgInput.length === 0) {
      alert('Invalid value');
      return;
    }

    console.log(`to ${remote}`);
    client
      .sendMessageToPeer({ text: msgInput }, remote)
      .then((res) => {
        if (res.hasPeerReceived) {
          console.log('received');
        } else {
          console.log('error received');
        }
      })
      .then(() => {
        AddText(msgInput);
        setMsgInput('');
      })
      .catch((err) => {
        console.log('error received', err);
      });
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

          <button disabled={!user} type='button' onClick={onLogin}>
            로그인
          </button>
        </div>
      ) : (
        <div>
          <h3>Hello, {config.uid}</h3>
          <button type='button' onClick={onLogOut}>
            로그아웃
          </button>

          <input
            type='text'
            placeholder='상대방의 ID를 입력해주세요'
            disabled={onSave}
            value={remote}
            onChange={(e) => setRemote(e.target.value)}
          />
          <button type='button' disabled={onSave} onClick={() => setOnSave(true)}>
            저장
          </button>

          <S.MessageWrap>
            <div className='conversation'></div>

            <form className='form-wrap' onSubmit={onSend}>
              <input type='text' value={msgInput} onChange={(e) => setMsgInput(e.target.value)} />
              <button type='submit'>전송</button>
            </form>
          </S.MessageWrap>
        </div>
      )}
    </>
  );
};

export default RTMPeerToPeer;

/**
 * 1. 유저 선택 (로그인)
 * 2. 상태 변화 감지 (ConnectionStateChanged)
 * 3. 감지를 바탕으로 누가 들어와있는지 파악하기
 * 4. 상대방(B)에게 메시지 보내기 (sendMessageToPeer)
 * 5. 상대방(B)은 메시지를 감지 (MessageFromPeer)
 * 6. 유저(A)는 메시지를 보낸 결과를 받음 (PeerMessageSendResult)
 */
