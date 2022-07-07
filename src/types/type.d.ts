import { CloudDriveResourceConvertProgress } from './stores/domain/common/cloud-drive/type';
export declare enum ClassroomState {
  Idle = 0,
  Connecting = 1,
  Connected = 2,
  Reconnecting = 3,
  Error = 4,
}
export declare enum WhiteboardState {
  Idle = 0,
  Connecting = 1,
  Connected = 2,
  Reconnecting = 3,
  Disconnecting = 4,
}
/**
 * 教育SDK房间枚举
 * Room1v1Class = 1，1v1
 * RoomSmallClass = 4，小班课
 */
export declare enum EduRoomTypeEnum {
  Room1v1Class = 0,
  RoomSmallClass = 4,
  RoomBigClass = 2,
  RoomGroup = 101,
}
/**
 * 教育SDK房间类型子类型
 */
export declare enum EduRoomSubtypeEnum {
  /**
   * 标准房间
   */
  Standard = 0,
  /**
   * 职业教育房间
   */
  Vocational = 1,
}
export declare enum EduRoomServiceTypeEnum {
  RTC = 0,
  Live = 1,
  BlendCDN = 2,
  MixRTCCDN = 3,
}
/**
 * 教育SDK角色枚举
 * invisible = 0,为观众
 * teacher = 1，为老师
 * student = 2，为学生
 * assistant = 3，为助教
 * observer = 4，为监课
 */
export declare enum EduRoleTypeEnum {
  none = -1,
  invisible = 0,
  teacher = 1,
  student = 2,
  assistant = 3,
  observer = 4,
}
export interface EduSessionInfo {
  roomUuid: string;
  roomName: string;
  roomType: EduRoomTypeEnum;
  roomSubtype: EduRoomSubtypeEnum;
  roomServiceType?: EduRoomServiceTypeEnum;
  userUuid: string;
  userName: string;
  role: EduRoleTypeEnum;
  token: string;
  flexProperties: any;
  duration: number;
  startTime?: number;
}
export declare type StorageCourseWareItem = {
  size: string;
  updateTime: string;
  progress: number;
  resourceName: string;
  resourceUuid: string;
  taskUuid: string;
  status: DownloadFileStatus;
  type: StorageFileType;
  download?: boolean;
};
export interface BoardToolItem {
  value: string;
  label: any;
  icon: string;
  isActive?: boolean;
  hover?: boolean;
  component?: any;
}
export declare enum DownloadFileStatus {
  Cached = 'cached',
  Downloading = 'downloading',
  NotCached = 'NotCached',
}
export declare type StorageFileType = string;
export declare type CourseWareItem = {
  resourceName: string;
  resourceUuid: string;
  ext: string;
  url?: string;
  size: number;
  updateTime: number;
  taskUuid?: string;
  taskProgress?: CloudDriveResourceConvertProgress;
  conversion?: any;
  initOpen?: boolean;
};
export declare type CourseWareList = CourseWareItem[];
export declare type AgoraConvertedFile = {
  width: number;
  height: number;
  ppt: {
    width: number;
    src: string;
    height: number;
  };
  conversionFileUrl: string;
};
export declare type ConvertedFileList = AgoraConvertedFile[];
export declare type FetchImageResult = {
  width: number;
  height: number;
  file: File;
  uuid: string;
  url: string;
};
export declare type BaseImageSize = {
  width: number;
  height: number;
};
export declare type Color = {
  r: number;
  g: number;
  b: number;
};
export declare enum Identity {
  host = 'host',
  guest = 'guest',
}
export declare enum AgoraEduEventType {
  classroomEvents = 'classroom-events',
}
export declare enum AgoraEduClassroomEvent {
  Ready = 1,
  Destroyed = 2,
  KickOut = 101,
  TeacherTurnOnMyMic = 102,
  TeacherTurnOffMyMic = 103,
  TeacherGrantPermission = 104,
  TeacherRevokePermission = 105,
  UserAcceptToStage = 106,
  UserLeaveStage = 107,
  RewardReceived = 108,
  TeacherTurnOnMyCam = 109,
  TeacherTurnOffMyCam = 110,
  CurrentCamUnplugged = 111,
  CurrentMicUnplugged = 112,
  CurrentSpeakerUnplugged = 113,
  CaptureScreenPermissionDenied = 114,
  ScreenShareStarted = 115,
  ScreenShareEnded = 116,
  BatchRewardReceived = 117,
  InvitedToGroup = 118,
  MoveToOtherGroup = 119,
  JoinSubRoom = 120,
  LeaveSubRoom = 121,
  AcceptedToGroup = 122,
  UserJoinGroup = 123,
  UserLeaveGroup = 124,
  RejectedToGroup = 125,
  RTCStateChanged = 201,
  ClassStateChanged = 202,
}
export declare type RecordOptions = {
  minFPS: number;
  maxFPS: number;
  resolution: number;
  autoResolution: boolean;
  autoFPS: boolean;
};
