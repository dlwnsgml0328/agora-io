import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CLASS_ROOM_CONFIG } from '../../config';

const { APP_ID, TEACHER, STUDENT1, STUDENT2 } = CLASS_ROOM_CONFIG;

const USER_TEACHER = {
  uid: 'teacher',
  uname: 'teacher',
  token: TEACHER,
  roleType: 1,
};

const USER_STUDENT1 = {
  uid: 'stu1',
  uname: 'stu1',
  token: STUDENT1,
  roleType: 2,
};

const USER_STUDENT2 = {
  uid: 'stu2',
  uname: 'stu2',
  token: STUDENT2,
  roleType: 2,
};

const AgoraFlexibleClassroom = () => {
  const [isRoom, setIsRoom] = useState(false);
  const [user, setUser] = useState('');
  const [infoModal, setInfoModal] = useState(true);

  const [config, setConfig] = useState({
    uid: '',
    uname: '',
    token: '',
    roleType: -999,
  });
  const [roomId, setRoomId] = useState('');

  const setCurrentUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
    if (e.target.value === 'A') {
      setConfig(USER_TEACHER);
    } else if (e.target.value === 'B') {
      setConfig(USER_STUDENT1);
    } else {
      setConfig(USER_STUDENT2);
    }
  };

  const onChangeRoom = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 4) {
      alert('Invalid length, must be 4 characters');
      return;
    }

    setRoomId(e.target.value);
  }, []);

  const launch = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setIsRoom(true);

      console.log('@ launch start!', { ...config }, typeof roomId, roomId);
      // @ts-ignore
      await window.AgoraEduSDK.config({
        appId: APP_ID,
        region: 'NA',
      });
      // @ts-ignore
      await window.AgoraEduSDK.launch(document.querySelector(`#launch-dom`), {
        rtmToken: config.token,
        userUuid: config.uid,
        userName: config.uname,
        roomUuid: roomId,
        roleType: config.roleType,
        roomType: 4,
        roomName: 'demo-class',
        pretest: false,
        language: 'en',
        startTime: new Date().getTime(),
        duration: 60 * 60,
        courseWareList: [],
        listener: (evt: any) => {
          console.log('evt', evt);
        },
      });
    },
    [config, roomId]
  );

  const insertScript = (url: string) => {
    if (
      Array.from(document.scripts).some((script) => script.src === window.location.origin + url)
    ) {
      setInfoModal(false);
      return;
    }

    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);
    setInfoModal(false);
  };

  useEffect(() => {
    insertScript(process.env.PUBLIC_URL + '/bundle/edu_sdk.bundle.js');
  }, []);

  return (
    <>
      {!infoModal ? (
        <>
          {!isRoom ? (
            <LoginWrap>
              <form onSubmit={launch}>
                <div className='input-radio' onChange={setCurrentUser}>
                  <label>
                    <input type='radio' name='user' value='A' />
                    <span>A (선생님)</span>
                  </label>
                  <label>
                    <input type='radio' name='user' value='B' />
                    <span>B (학생 1)</span>
                  </label>
                  <label>
                    <input type='radio' name='user' value='C' />
                    <span>C (학생 2)</span>
                  </label>
                </div>
                <div>
                  <input
                    type='number'
                    style={{
                      border: '1px solid #000',
                      padding: '2px 8px',
                    }}
                    placeholder='Please enter your room id (0328)'
                    onChange={onChangeRoom}
                  />

                  <button
                    className='enter-btn'
                    disabled={user.length === 0 || roomId.length === 0}
                    type='submit'
                    style={{ border: '1px solid #000', padding: '2px 8px' }}
                  >
                    enter
                  </button>
                </div>

                <div className='info'>
                  처음 방을 만드는 경우, <b>선생님을 선택해서 방을 만들어야</b> 이후 학생으로 입장이
                  가능합니다.
                </div>
              </form>
            </LoginWrap>
          ) : (
            <EazelWrap>
              <iframe className='eazel-iframe' src='https://eazel.net' title='iframe'></iframe>
              <div className='eazel-chat'>
                <div id='launch-dom'></div>
              </div>
            </EazelWrap>
          )}
        </>
      ) : (
        <div>
          <h1>Loading...</h1>
        </div>
      )}
    </>
  );
};

export default AgoraFlexibleClassroom;

const LoginWrap = styled.div`
  input {
    vertical-align: middle;
    margin-right: 5px;
  }

  .input-radio {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .info {
    margin-top: 2%;
  }

  .enter-btn:disabled {
    background: #7a7a7a;
    cursor: not-allowed;
  }
`;

const EazelWrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  .eazel-iframe {
    width: 80%;
  }

  .eazel-chat {
    width: 20%;
  }

  #launch-dom {
    height: 100%;
  }

  @media screen and (max-width: 480px) {
    overflow-y: scroll;
    flex-wrap: wrap;

    .eazel-iframe {
      display: none;
    }

    .eazel-chat {
      width: 100%;
    }

    #launch-dom {
      min-height: 1200px;

      .video-player-overlay .video-player {
        width: 380px !important;
        height: 200px !important;
      }

      .chat-panel {
        height: 80%;
      }
      #netless-white {
        flex-direction: row;
      }
    }
  }
`;