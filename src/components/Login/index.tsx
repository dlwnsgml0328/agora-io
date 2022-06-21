import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './index.styles';
const Login = () => {
  const [id, setId] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  });

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
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log(`welcome ${id}!`);

      setId('');
    },
    [id]
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
