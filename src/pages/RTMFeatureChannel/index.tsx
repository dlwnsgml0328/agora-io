import AgoraRTM, { LocalInvitation, RtmStatusCode } from 'agora-rtm-sdk';
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

  // 유저 검색 기능 구현
  const [inviteModal, setInviteModal] = useState(false);

  const [searchUser, setSearchUser] = useState('');
  const [resultUserList, setResultUserList] = useState<IresultUserList[]>([]);

  // 초대 로직 구현
  const [localInvitation, setLocalInvitation] = useState<LocalInvitation>();
  const [localResponse, setLocalResponse] = useState({ state: '', response: '' });

  const scrollRef = useRef<HTMLDivElement>(null);

  const { connectionState, onModal, setOnModal, remoteInvitation } = useRTMClient(client);
  const { channelState, scroll, memberList } = useRTMChannel(channel);

  // 초대를 통해 join 한 멤버의 상태값을 업데이트 해주는 훅 함수
  useEffect(() => {
    if (resultUserList.length === 0) return;

    if (channelState.msg !== 'memberJoined') return;

    if (
      resultUserList.some((user) => user.id === channelState.id) &&
      resultUserList.find((user) => user.id === channelState.id)?.canInvite === true
    ) {
      let states = [...resultUserList];

      states.find((user) => user.id === channelState.id)!.canInvite = !states.find(
        (user) => user.id === channelState.id
      )!.canInvite;

      setResultUserList(states);
    }
  }, [resultUserList, channelState, memberList]);

  useEffect(() => {
    if (localResponse.state) console.log('localInvitation updated:', localResponse);
  }, [localResponse]);

  useEffect(() => {
    if (!localInvitation) return;

    const localInvitationReceivedByPeer = () => {
      setLocalResponse({ state: 'localInvitationReceivedByPeer', response: '' });
    };
    const localInvitationAccepted = (response: string) => {
      setLocalResponse({ state: 'localInvitationAccepted', response: response });
    };
    const localInvitationRefused = (response: string) => {
      setLocalResponse({ state: 'localInvitationRefused', response: response });
    };
    const localInvitationFailure = (response: RtmStatusCode.LocalInvitationFailureReason) => {
      setLocalResponse({ state: 'localInvitationFailure', response: response });
    };
    const localInvitationCanceled = () => {
      setLocalResponse({ state: 'localInvitationCanceled', response: '' });
    };

    localInvitation.on('LocalInvitationReceivedByPeer', localInvitationReceivedByPeer);
    localInvitation.on('LocalInvitationAccepted', localInvitationAccepted);
    localInvitation.on('LocalInvitationRefused', localInvitationRefused);
    localInvitation.on('LocalInvitationFailure', localInvitationFailure);
    localInvitation.on('LocalInvitationCanceled', localInvitationCanceled);

    return () => {
      localInvitation.off('LocalInvitationReceivedByPeer', localInvitationReceivedByPeer);
      localInvitation.off('LocalInvitationAccepted', localInvitationAccepted);
      localInvitation.off('LocalInvitationRefused', localInvitationRefused);
      localInvitation.off('LocalInvitationFailure', localInvitationFailure);
      localInvitation.off('LocalInvitationCanceled', localInvitationCanceled);
    };
  }, [localInvitation]);

  useEffect(() => {
    if (!remoteInvitation) return;

    const remoteInvitationCanceled = (content: string) => {
      console.log('@ RemoteInvitationCanceled 🔥', content);
    };

    const remoteInvitationFailure = (reason: RtmStatusCode.RemoteInvitationFailureReason) => {
      console.log('@ RemoteInvitationFailure 🔥', reason);
    };

    const remoteInvitationRefused = () => {
      console.log('@ RemoteInvitationRefused 🔥');
    };

    remoteInvitation.on('RemoteInvitationCanceled', remoteInvitationCanceled);
    remoteInvitation.on('RemoteInvitationFailure', remoteInvitationFailure);
    remoteInvitation.on('RemoteInvitationRefused', remoteInvitationRefused);

    return () => {
      remoteInvitation.off('RemoteInvitationCanceled', remoteInvitationCanceled);
      remoteInvitation.off('RemoteInvitationFailure', remoteInvitationFailure);
      remoteInvitation.off('RemoteInvitationRefused', remoteInvitationRefused);
    };
  }, [remoteInvitation]);

  useEffect(() => {
    if (connectionState.newState) {
      console.log('@ connectionStateChanged', connectionState);

      if (connectionState.newState === 'ABORTED') {
        if (channel && isChannel)
          channel
            .leave()
            .then(() => setIsChannel(false))
            .catch((err) => console.error('error occurred in leave callback', err));
        client
          .logout()
          .then(() => console.log('@ logout completed'))
          .then(() => setAuth(false))
          .catch((err) => console.error('error occurred in logout callback', err));
      }
    }
  }, [connectionState, isChannel]);

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

        if (peer === config.uid) {
          setResultUserList((prevArr) => [...prevArr, { id: peer, canInvite: false }]);
        } else if (memberList.some((user) => user === peer)) {
          setResultUserList((prevArr) => [...prevArr, { id: peer, canInvite: false }]);
        } else {
          setResultUserList((prevArr) => [...prevArr, { id: peer, canInvite: response[peer] }]);
        }

        setSearchUser('');
      });
    },
    [resultUserList, config, memberList]
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

  // 초대 로직 구현
  const onInvite = (calleeId: string) => {
    const localInvitation = client.createLocalInvitation(calleeId);
    // TODO: invitation을 만들 때, 채널 id 와 같은 정보가 어떻게 삽입되는지 알아야 한다
    setLocalInvitation(localInvitation);
    localInvitation.channelId = 'test_eazel';
    localInvitation.content = 'welcome eazel test channel';
    localInvitation.send();
  };

  const acceptInvitation = useCallback(async () => {
    remoteInvitation?.accept();

    await channel
      .join()
      .then(() => {
        setIsChannel(true);
        setOnModal(false);
      })
      .catch((err) => {
        console.error('error occurred in join channel', err);
      });
  }, [remoteInvitation, setOnModal]);

  const refuseInvitation = useCallback(() => {
    remoteInvitation?.refuse();
    setOnModal(false);
  }, [remoteInvitation, setOnModal]);

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
                        <button
                          disabled={!user.canInvite}
                          type='button'
                          onClick={() => onInvite(user.id)}
                        >
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
          {onModal && (
            <S.InvitationModalWrap>
              <div className='modal'>
                <span className='exit' onClick={() => refuseInvitation()}>
                  X
                </span>
                <h3>Invitation</h3>

                <p>초대한 인원: {remoteInvitation!.callerId}</p>
                <p>초대한 채널: {remoteInvitation?.channelId || '없음'}</p>
                <p>컨텐츠: {remoteInvitation?.content || '없음'}</p>

                <div className='button-group'>
                  <button type='button' onClick={acceptInvitation}>
                    수락
                  </button>
                  <button type='button' onClick={refuseInvitation}>
                    거절
                  </button>
                </div>
              </div>
            </S.InvitationModalWrap>
          )}
        </div>
      )}
    </div>
  );
};

export default RTMFeatureChannel;
