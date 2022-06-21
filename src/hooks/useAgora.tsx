import AgoraRTC, {
  CameraVideoTrackInitConfig,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  MicrophoneAudioTrackInitConfig,
} from 'agora-rtc-sdk-ng';
import { useEffect, useState } from 'react';

const useAgora = (
  client: IAgoraRTCClient | undefined
): {
  localAudioTrack: ILocalAudioTrack | undefined;
  localVideoTrack: ILocalVideoTrack | undefined;
  joinState: boolean;
  leave: Function;
  join: Function;
  remoteUsers: IAgoraRTCRemoteUser[];
} => {
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | undefined>(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | undefined>(undefined);

  const [joinState, setJoinState] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  const createLocalTracks = async (
    audioConfig?: MicrophoneAudioTrackInitConfig,
    videoConfig?: CameraVideoTrackInitConfig
  ): Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]> => {
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
      audioConfig,
      videoConfig
    );
    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);

    return [microphoneTrack, cameraTrack];
  };

  const join = async (appid: string, channel: string, token: string, uid: string | number) => {
    if (!client) return;

    console.log('@ join called');
    const [microphoneTrack, cameraTrack] = await createLocalTracks();

    await client
      .join(appid, channel, token, uid)
      .then(() => console.log('@client joined success'))
      .catch((err) => console.log('@client joined error', err));
    await client
      .publish([microphoneTrack, cameraTrack])
      .then(() => console.log('@ publish success'))
      .catch((err) => console.log('@client publish error', err));

    setJoinState(true);
  };

  const leave = async () => {
    if (!client) return;

    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }

    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    setRemoteUsers([]);
    setJoinState(false);
    await client.leave();
  };

  useEffect(() => {
    if (!client) return;
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      console.log('@ handleUser Published 🔥', user, mediaType);
      await client.subscribe(user, mediaType);
      // toggle rerender while state of remoteUsers changed.
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };
    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      console.log('@ handleUser UnPublished 🔥', user);
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };
    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      console.log('@ handleUser Joined 🔥', user);
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };
    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      console.log('@ handleUser Left 🔥', user);
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
    };
  }, [client]);

  return { localAudioTrack, localVideoTrack, joinState, leave, join, remoteUsers };
};

export default useAgora;
