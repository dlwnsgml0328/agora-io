import AgoraRTM, { LocalInvitation, RtmStatusCode } from 'agora-rtm-sdk';
import { useEffect, useState } from 'react';
import useRTMClient from '../../hooks/useRTMClient';
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

const RTMCallInvitation = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [config, setConfig] = useState({ uid: '', token: '' });
  const [localInvitation, setLocalInvitation] = useState<LocalInvitation>();
  const [response, setResponse] = useState({ state: '', response: '' });

  const { receivedInvitation } = useRTMClient(client);

  useEffect(() => {
    if (receivedInvitation) console.log('receivedInvitation: ', receivedInvitation);
  }, [receivedInvitation]);

  useEffect(() => {
    if (response.state) console.log('localInvitation updated:', response);
  }, [response]);

  useEffect(() => {
    if (!localInvitation) return;

    const localInvitationReceivedByPeer = () => {
      setResponse({ state: 'localInvitationReceivedByPeer', response: '' });
    };
    const localInvitationAccepted = (response: string) => {
      setResponse({ state: 'localInvitationAccepted', response: response });
    };
    const localInvitationRefused = (response: string) => {
      setResponse({ state: 'localInvitationAccepted', response: response });
    };
    const localInvitationFailure = (response: RtmStatusCode.LocalInvitationFailureReason) => {
      setResponse({ state: 'localInvitationFailure', response: response });
    };
    const localInvitationCanceled = () => {
      setResponse({ state: 'localInvitationCanceled', response: '' });
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

  const onInvite = () => {
    let calleeId = config.uid === USER_A.uid ? USER_B.uid : USER_A.uid;
    const localInvitation = client.createLocalInvitation(calleeId);
    setLocalInvitation(localInvitation);

    localInvitation.send();
  };

  return (
    <S.CallInvitationWrap>
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
          <input type='text' value={config.uid === USER_A.uid ? USER_B.uid : USER_A.uid} disabled />
          <button type='button' onClick={onInvite}>
            초대하기
          </button>
        </div>
      )}
    </S.CallInvitationWrap>
  );
};

export default RTMCallInvitation;

/**
 * 1. 유저 선택
 * 2. 초대장 만들기 (createLocalInvitation)
 * 3. 초대 보내기 (send)
 * 4. 상대방(B)은 로컬(A)유저의 초대장을 받음 (RemoteInvitationReceived)
 * 5. 초대 요청에 대한 취소 또는 성공 (cancel / onSuccess) 반환
 * 6. 상대방(B)의 초대에 대한 회신
 * 7. 로컬(A)유저에게 회신 전달
 */
