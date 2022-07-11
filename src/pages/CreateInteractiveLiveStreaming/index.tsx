import AgoraRTC, { ClientRole } from 'agora-rtc-sdk-ng';
import { useCallback, useEffect, useRef, useState } from 'react';
import LocalMediaPlayer from '../../components/LocalMediaPlayer';
import RemoteMediaPlayer from '../../components/RemoteMediaPlayer';
import { LIVE_CONFIG } from '../../config';
import useAgoraLive from '../../hooks/useAgoraLive';

// mode rtc <-> live

/**
 * 라이브 스트리밍 서비스를 사용하고 있음 토큰은 LIVE TOKEN
 */
const client = AgoraRTC.createClient({ codec: 'h264', mode: 'live' });

const CreateInteractiveLiveStreaming = () => {
  const [id, setId] = useState('');
  const [role, setRole] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);

  const { APP_ID, CHANNEL, TOKEN } = LIVE_CONFIG;
  const { localVideoTrack, leave, join, joinState, remoteUsers } = useAgoraLive(client);

  useEffect(() => {
    if (roleRef.current) roleRef.current.focus();
  }, []);

  const setCurrentRole = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
    localStorage.setItem('role', e.target.value);
  }, []);

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

  const onSubmit = useCallback(() => {
    if (role.length < 1) {
      alert('Invalid role, must be one of the following: ' + role);
      return;
    }

    if (id.length < 3) {
      alert('Invalid length, must be at least 3 characters');
      return;
    }

    join(APP_ID, CHANNEL, TOKEN, Number(id), role);
  }, [id, APP_ID, CHANNEL, TOKEN, role, join]);

  const changeRole = useCallback(
    (role: ClientRole) => {
      setRole(role);
      join(APP_ID, CHANNEL, TOKEN, Number(id), role);
    },
    [id, APP_ID, CHANNEL, TOKEN, join]
  );

  return (
    <div>
      <h3>Create Interactive live streaming</h3>

      {!joinState ? (
        <div>
          <div onChange={setCurrentRole}>
            <label>
              <input type='radio' name='role' value='host' />
              host
            </label>
            <label>
              <input ref={roleRef} type='radio' name='role' value='audience' />
              audience
            </label>
          </div>
          <br />
          <input
            ref={inputRef}
            type='text'
            value={id}
            placeholder='write the numbers ex) 0000'
            style={{ width: '200px', marginRight: '5px' }}
            onChange={onChange}
          />
          <button type='button' onClick={onSubmit}>
            join
          </button>
        </div>
      ) : (
        <div>
          <h3>Welcome, You're {role}</h3>
          <button type='button' onClick={() => leave()}>
            leave
          </button>
          {role === 'audience' && (
            <button
              type='button'
              onClick={() => {
                changeRole('host');
              }}
            >
              change host
            </button>
          )}

          <div className='MediaWrap' style={{ display: 'flex' }}>
            {role === 'host' && (
              <div style={{ marginRight: 10 }}>
                <p>
                  {localVideoTrack && `localVideoTrack`}
                  {joinState && localVideoTrack ? `(${client.uid})` : '?'}
                </p>
                <LocalMediaPlayer
                  videoTrack={localVideoTrack}
                  audioTrack={undefined}
                ></LocalMediaPlayer>
              </div>
            )}

            {remoteUsers.map((user) => (
              <div className='remote-player-wrapper' key={user.uid}>
                <p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p>

                <RemoteMediaPlayer
                  videoTrack={user.videoTrack}
                  audioTrack={user.audioTrack}
                ></RemoteMediaPlayer>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateInteractiveLiveStreaming;

/**   
  type FoobarBaz = ClientRole | 'Backstage';

  const role: FoobarBaz = 'Backstage';

  console.log('role:', role);
 */
