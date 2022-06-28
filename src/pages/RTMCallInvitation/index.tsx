import AgoraRTM, { LocalInvitation, RtmStatusCode } from 'agora-rtm-sdk';
import { useCallback, useEffect, useState } from 'react';
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
  const [localResponse, setLocalResponse] = useState({ state: '', response: '' });

  const { onModal, setOnModal, remoteInvitation } = useRTMClient(client);

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
  }, [remoteInvitation, setOnModal]);

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

  const acceptInvitation = useCallback(() => {
    remoteInvitation?.accept();
    setOnModal(false);
  }, [remoteInvitation, setOnModal]);

  const refuseInvitation = useCallback(() => {
    remoteInvitation?.refuse();
    setOnModal(false);
  }, [remoteInvitation, setOnModal]);

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
        <>
          <div>
            <h3>Hello, {config.uid}</h3>
            <button type='button' onClick={onLogOut}>
              로그아웃
            </button>
            <input
              type='text'
              value={config.uid === USER_A.uid ? USER_B.uid : USER_A.uid}
              disabled
            />
            <button type='button' onClick={onInvite}>
              초대하기
            </button>
          </div>

          {onModal && (
            <S.InvitationModalWrap>
              <div className='modal'>
                <span className='exit' onClick={() => refuseInvitation()}>
                  X
                </span>
                <h3>Modal 있음</h3>

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
        </>
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
