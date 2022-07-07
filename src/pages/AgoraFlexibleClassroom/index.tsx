import { useCallback, useEffect, useState } from 'react';
import * as S from './index.styles';

import { CLASS_ROOM_CONFIG } from '../../config';
import { AgoraEduClassroomEvent } from '../../types/agora';

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
  const [rate, setRate] = useState(0);
  const [downloadDone, setDownloadDone] = useState(false);
  const [isRoom, setIsRoom] = useState(false);
  const [user, setUser] = useState('');

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
        listener: (evt: AgoraEduClassroomEvent) => {
          catchEvent(evt);
        },
      });
    },
    [config, roomId]
  );

  const catchEvent = (evt: AgoraEduClassroomEvent) => {
    console.log('🔥 event come in!', evt);
    switch (evt) {
      case AgoraEduClassroomEvent.Ready:
        console.log('🔥 ready!', evt);
        break;
      case AgoraEduClassroomEvent.Destroyed:
        console.log('🔥 destroyed!', evt);
        const yes = window.confirm(`press 'yes' if you want to refresh or exit the app!`);
        if (yes) window.history.go(0);
        break;
      case AgoraEduClassroomEvent.RTCStateChanged:
        console.log('🔥 RTC state changed!', evt);
        break;
      default:
        break;
    }
  };

  const insertScript = useCallback((url: string) => {
    if (hasScript(url)) return;
    download();
    addScript(url);
  }, []);

  function hasScript(url: string) {
    return Array.from(document.scripts).some(
      (script) => script.src === window.location.origin + url
    );
  }

  function download() {
    var xhr = new XMLHttpRequest();

    // 성공
    xhr.onload = (e) => {
      console.log('upload complete', e);
      setDownloadDone(true);
    };
    // 다운중
    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        let percentComplete = Math.floor((e.loaded / e.total) * 100);
        setRate(percentComplete);
      } else {
      }
    };
    // 중단
    xhr.onabort = () => {
      console.error('Upload cancelled.');
      setTimeout(() => {
        window.history.go(0);
      }, 3000);
    };

    xhr.open(
      'GET',
      'https://eazel-io.s3.ap-northeast-2.amazonaws.com/uploads/immsi/edu_sdk.bundle.js'
    );

    xhr.send();
  }

  function addScript(url: string) {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);
  }

  useEffect(() => {
    insertScript(process.env.PUBLIC_URL + '/bundle/edu_sdk.bundle.js');
  }, [insertScript]);

  return (
    <>
      {downloadDone ? (
        <>
          {!isRoom ? (
            <S.LoginWrap>
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
                  처음 방을 만드는 경우, <b>우선 선생님을 선택해서 방을 만들어야</b> 학생으로 입장이
                  가능합니다.
                </div>
              </form>
            </S.LoginWrap>
          ) : (
            <S.EazelWrap>
              <iframe className='eazel-iframe' src='https://eazel.net' title='iframe'></iframe>
              <div className='eazel-chat'>
                <div id='launch-dom'></div>
              </div>
            </S.EazelWrap>
          )}
        </>
      ) : (
        <S.LoadingWrap>
          <h1>Loading...</h1>

          <progress className='pro' max={100} value={rate} />
        </S.LoadingWrap>
      )}
    </>
  );
};

export default AgoraFlexibleClassroom;
