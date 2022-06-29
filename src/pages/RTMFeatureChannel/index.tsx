import AgoraRTM from 'agora-rtm-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';
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

interface IresultUserList {
  id: string;
  canInvite: boolean;
}

const RTMFeatureChannel = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [config, setConfig] = useState({ uid: '', token: '' });
  const [isChannel, setIsChannel] = useState(false);
  const [msgInput, setMsgInput] = useState('');

  const [inviteModal, setInviteModal] = useState(false);

  const [searchUser, setSearchUser] = useState('');
  const [resultUserList, setResultUserList] = useState<IresultUserList[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const { connectionState } = useRTMClient(client);
  const { channelState, scroll, memberList } = useRTMChannel(channel);

  useEffect(() => {
    console.log('@ resultUserList 🔥:', resultUserList);
  }, [resultUserList]);

  useEffect(() => {
    if (connectionState.newState) {
      console.log('@ connectionStateChanged', connectionState);
    }
  }, [connectionState]);

  useEffect(() => {
    if (channelState) console.log('@ channelState updated:', channelState);
  }, [channelState]);

  useEffect(() => {
    if (!msgInput) scrollToBottom();

    return () => {
      scrollToBottom();
    };
  }, [msgInput, scroll]);

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

  const isPeer = (arr: IresultUserList[], peer: string) => {
    return arr.some((user) => user.id === peer);
  };

  const checkSearchUser = useCallback(
    async (peerIds: string[]) => {
      // 현재 온라인 상태를 검색할 때, 배열로 검색하는 메서드만 제공되고 있음
      let peer = peerIds[0];

      if (isPeer(resultUserList, peer)) {
        let states = [...resultUserList];

        states = resultUserList.filter((user) => user.id !== peer);
        setResultUserList(states);
      }

      await client.queryPeersOnlineStatus(peerIds).then((response) => {
        // console.log('response', response, response[searchUser]); // {0328: false, 1796: true, 9170: false}

        setSearchUser('');

        setResultUserList((prevArr) => [...prevArr, { id: peer, canInvite: response[peer] }]);
      });
    },
    [resultUserList]
  );

  const onSubmitSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      checkSearchUser(Array(searchUser));
    },
    [checkSearchUser, searchUser]
  );

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const exitModal = () => {
    setInviteModal(false);
    setSearchUser('');
    setResultUserList([]);
  };

  return (
    <div>
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
          <h3>Hello, {config.uid}</h3>
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
            <S.ChannelWrap>
              <div className='message-wrap'>
                <p>
                  <span>In channel: {channel.channelId}</span>
                </p>

                <div ref={scrollRef} className='conversation'></div>

                <form className='form-wrap' onSubmit={onSend}>
                  <input
                    type='text'
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                  />
                  <button type='submit'>전송</button>
                </form>
              </div>

              <div className='channel-user-wrap'>
                <p>
                  <span>user list</span>

                  <button type='button' className='invite' onClick={() => setInviteModal(true)}>
                    ⚙️
                  </button>
                </p>
                <ul>
                  {memberList.map((member, idx) => (
                    <li key={idx}>
                      <span className={member === config.uid ? 'you' : undefined}>
                        {member} {member === config.uid ? '🧑🏻‍💻' : '👩🏻‍💻'}
                      </span>
                      <span className='online'></span>
                    </li>
                  ))}
                </ul>
              </div>

              {inviteModal && (
                <div className='invite-modal-wrap'>
                  <p>
                    <span className='title'>invite user</span>

                    <span className='exit' onClick={() => exitModal()}>
                      X
                    </span>
                  </p>

                  <ul>
                    {resultUserList.map((user, idx) => (
                      <li key={idx}>
                        <span>{user.id}</span>
                        <button disabled={!user.canInvite} type='button'>
                          초대
                        </button>
                      </li>
                    ))}
                  </ul>

                  <form className='search-wrap' onSubmit={onSubmitSearch}>
                    <input
                      type='text'
                      value={searchUser}
                      placeholder='ex) 0328'
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                    <button type='submit'>검색</button>
                  </form>
                </div>
              )}
            </S.ChannelWrap>
          )}
        </div>
      )}
    </div>
  );
};

export default RTMFeatureChannel;
