import AgoraRTC from 'agora-rtc-sdk-ng';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import MediaPlayer from '../../components/MediaPlayer';
import { config } from '../../config';
import useAgora from '../../hooks/useAgora';

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });

const CreateRemoteTracksV2 = () => {
  const [id, setId] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const { APP_ID, CHANNEL, TOKEN } = config;
  const { localVideoTrack, leave, join, joinState, remoteUsers } = useAgora(client);

  useEffect(() => {
    console.log('@ localVideoTrack', localVideoTrack);
  }, [localVideoTrack]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
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
    if (id.length < 3) {
      alert('Invalid length, must be at least 3 characters');
      return;
    }

    join(APP_ID, CHANNEL, TOKEN, Number(id));
  }, [id, APP_ID, CHANNEL, TOKEN, join]);

  return (
    <div>
      <h3>CreateRemoteTracksV2</h3>

      {!joinState ? (
        <>
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
        </>
      ) : (
        <div>
          <h1>Hello </h1>
          <button type='button' onClick={() => leave()}>
            leave
          </button>
          <p>
            {localVideoTrack && `localVideoTrack`}
            {joinState && localVideoTrack ? `(${client.uid})` : '?'}
          </p>
          <MediaPlayer videoTrack={localVideoTrack} audioTrack={undefined}></MediaPlayer>

          {remoteUsers.map((user) => (
            <div className='remote-player-wrapper' key={user.uid}>
              <p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p>
              <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateRemoteTracksV2;
