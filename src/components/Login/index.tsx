import AgoraRTC from 'agora-rtc-sdk-ng';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '../../config';
import * as S from './index.styles';

interface IAuth {
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = ({ setAuth }: IAuth) => {
  const [id, setId] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  });

  const client = AgoraRTC.createClient({
    codec: 'vp8',
    mode: 'rtc',
  });

  const { APP_ID, CHANNEL, TOKEN } = config;

  const join = useCallback(
    async (id: string) => {
      await client
        .join(APP_ID, CHANNEL, TOKEN, id)
        .then((res) => {
          console.log(`@ join ${res}`);
        })
        .catch((err) => {
          console.error(`@ err occurred in join ${err}`);
        });
    },

    [client, APP_ID, CHANNEL, TOKEN]
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
