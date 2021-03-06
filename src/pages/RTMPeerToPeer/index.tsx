import AgoraRTM from 'agora-rtm-sdk';
import { useCallback, useEffect, useState } from 'react';
import useRTMPeer from '../../hooks/useRTMPeer';
import * as S from './index.styles';

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
  const [canMessage, setCanMessage] = useState(false);

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

    client
      .sendMessageToPeer({ text: msgInput }, remote)
      .then(() => {
        AddText(msgInput);
        setMsgInput('');
      })
      .catch((err) => {
        console.error('error received', err);
      });
  };

  const AddText = (msg: string) => {
    const textArea = document.querySelector('.conversation');

    const text = document.createElement('div');
    text.className = 'local';
    text.innerHTML = `<span class="uid">????</span><span class="msg">${msg}</span>`;

    if (textArea) textArea.append(text);
  };

  const checkRemoteUser = useCallback(
    async (peersId: string[]) => {
      await client.queryPeersOnlineStatus(peersId).then((response) => {
        console.log('response', response, response[remote]); // {0328: false, 1796: true, 9170: false}
        if (response[remote]) setCanMessage(true);
      });
      setOnSave(true);
    },
    [remote]
  );

  return (
    <S.PeerToPeerWrap>
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
            ?????????
          </button>
        </div>
      ) : (
        <div>
          <h3>Hello, {config.uid}</h3>
          <button type='button' onClick={onLogOut}>
            ????????????
          </button>

          <input
            className='checkRemote'
            type='text'
            placeholder='???????????? ID??? ??????????????????'
            disabled={onSave}
            value={remote}
            onChange={(e) => setRemote(e.target.value)}
          />
          <button type='button' disabled={onSave} onClick={() => checkRemoteUser(Array(remote))}>
            ??????
          </button>

          <S.MessageWrap>
            <div className='conversation'></div>

            <form className='form-wrap' onSubmit={onSend}>
              <input
                type='text'
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                disabled={!canMessage}
              />
              <button type='submit' disabled={!canMessage}>
                ??????
              </button>
            </form>
          </S.MessageWrap>
        </div>
      )}
    </S.PeerToPeerWrap>
  );
};

export default RTMPeerToPeer;

/**
 * 1. ?????? ?????? (?????????)
 * 2. ?????? ?????? ?????? (ConnectionStateChanged)
 * 3. ????????? ???????????? ?????? ?????????????????? ????????????
 * 4. ?????????(B)?????? ????????? ????????? (sendMessageToPeer)
 * 5. ?????????(B)??? ???????????? ?????? (MessageFromPeer)
 * 6. ??????(A)??? ???????????? ?????? ????????? ?????? (PeerMessageSendResult)
 */
