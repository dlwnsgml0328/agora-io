import AgoraRTC, {
  CameraVideoTrackInitConfig,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  MicrophoneAudioTrackInitConfig,
  ClientRole,
  IRemoteTrack,
  UID,
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

  const join = async (
    appid: string,
    channel: string,
    token: string,
    uid: string | number,
    role?: ClientRole
  ) => {
    if (!client) return;

    if (role) {
      client.setClientRole(role);

      // 일단 여기에 정의하기
    } else {
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

      (window as any).client = client;
      (window as any).videoTrack = cameraTrack;

      setJoinState(true);
    }
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
      await client
        .subscribe(user, mediaType)
        .then((res: IRemoteTrack) => console.log('@ subscribe response 🔥: ', res));
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
    const handleUserInfoUpdated = (uid: UID, msg: string) => {
      console.log('@ user-info-updated 🔥 ', uid, msg);
    };
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);

    // client.on('published-user-list', (users: IAgoraRTCRemoteUser) =>
    //   console.log('@ published-user-list updated 🔥', users)
    // );

    // https://docs.agora.io/en/Interactive%20Broadcast/API%20Reference/web_ng/interfaces/iagorartcclient.html#event_user_info_updated
    client.on('user-info-updated', handleUserInfoUpdated);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
      client.off('user-info-updated', handleUserInfoUpdated);
    };
  }, [client]);

  return { localAudioTrack, localVideoTrack, joinState, leave, join, remoteUsers };
};

export default useAgora;

/**
client.on("user-info-updated", (uid, msg) => {
  switch (msg) {
    case "mute-audio":  ...
    case "mute-video":  ... 
  }
});
 */
