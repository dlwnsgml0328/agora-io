import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from 'agora-rtc-sdk-ng';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '../../config';
import * as S from './index.styles';

interface IProps {
  client: IAgoraRTCClient;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalVideoTrack: React.Dispatch<React.SetStateAction<ILocalVideoTrack | undefined>>;
  setLocalAudioTrack: React.Dispatch<React.SetStateAction<ILocalAudioTrack | undefined>>;
  remoteUsers: IAgoraRTCRemoteUser | undefined;
  setRemoteUsers: React.Dispatch<React.SetStateAction<IAgoraRTCRemoteUser | undefined>>;
}

const Login = ({
  client,
  setAuth,
  setLocalVideoTrack,
  setLocalAudioTrack,
  remoteUsers,
  setRemoteUsers,
}: IProps) => {
  const [id, setId] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  });

  const { APP_ID, CHANNEL, TOKEN } = config;

  const makeLocal = useCallback(async () => {
    const video = await AgoraRTC.createCameraVideoTrack().then((res: ILocalVideoTrack) =>
      setLocalVideoTrack(res)
    );
    const audio = await AgoraRTC.createMicrophoneAudioTrack().then((res: ILocalAudioTrack) =>
      setLocalAudioTrack(res)
    );

    Promise.all([video, audio])
      .then(() => setAuth(true))
      .catch((err) => console.log('@ err in promise', err));
  }, [setAuth, setLocalVideoTrack, setLocalAudioTrack]);

  const handleUserPublished = useCallback(
    (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
      console.log('@ handleUser published 🅾️');

      const id = user.uid;
      console.log('catch remoteUsers', remoteUsers);
      let immsiUser: any = { ...remoteUsers };
      immsiUser[id] = user;

      console.log('catch remoteUsers', immsiUser);
      setRemoteUsers(immsiUser);

      client.subscribe(user, mediaType);
    },
    [client, remoteUsers, setRemoteUsers]
  );

  const handleUserUnpublished = useCallback(
    (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
      console.log('@ handleUser UnPublished ❌');
      if (mediaType === 'video') {
        const id = user.uid;

        let immsiUser: any = { ...remoteUsers };
        delete immsiUser[id];
      }
    },
    [remoteUsers]
  );

  const join = useCallback(
    async (id: string) => {
      client.on('user-published', handleUserPublished);
      client.on('user-unpublished', handleUserUnpublished);

      await client
        .join(APP_ID, CHANNEL, TOKEN, id)
        .then((res) => {
          console.log(`@ join ${res}`);
        })
        .then(() => makeLocal())
        .catch((err) => {
          console.error(`@ err occurred in join ${err}`);
        });
    },

    [client, APP_ID, CHANNEL, TOKEN, makeLocal, handleUserPublished, handleUserUnpublished]
  );

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value))) {
      alert('Invalid value, must be a number');
      return;
    }

    if (e.target.value.length > 4) {
      alert('Invalid length, must be 4 characters');
      return;
    }

    setId(e.target.value);
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (id.length < 3) {
        alert('Invalid length, must be at least 3 characters');
        return;
      }

      await join(id)
        .then(() => {
          console.log(`welcome ${id}!`);
          setId('');
          setAuth(true);
        })
        .catch(() => {
          console.error(`login failed, redirecting to login page`);
        });
    },
    [id, join, setAuth]
  );

  return (
    <S.LoginFormWrapper>
      <h3>Login Form</h3>

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type='text'
          value={id}
          placeholder='write the numbers ex) 0000'
          style={{ width: '200px', marginRight: '5px' }}
          onChange={onChange}
        />

        <button type='submit'>join</button>
      </form>
    </S.LoginFormWrapper>
  );
};

export default Login;
