import {
  CourseWareList,
  EduRoleTypeEnum,
  EduRoomServiceTypeEnum,
  EduRoomSubtypeEnum,
  EduRoomTypeEnum,
  RecordOptions,
} from './type';

export type LaunchOption = {
  userUuid: string;
  userName: string;
  roomUuid: string;
  roleType: EduRoleTypeEnum;
  roomType: EduRoomTypeEnum;
  roomSubtype?: EduRoomSubtypeEnum;
  roomServiceType?: EduRoomServiceTypeEnum;
  roomName: string;
  listener: ListenerCallback;
  pretest: boolean;
  rtmToken: string;
  language: LanguageEnum;
  startTime?: number;
  duration: number;
  courseWareList: CourseWareList;
  recordUrl?: string;
  widgets?: {
    [key: string]: IAgoraWidget;
  };
  userFlexProperties?: {
    [key: string]: any;
  };
  mediaOptions?: LaunchMediaOptions;
  latencyLevel?: 1 | 2;
  platform?: Platform;
  extensions?: IAgoraExtensionApp[];
  recordOptions?: RecordOptions;
  recordRetryTimeout?: number;
};

export declare type ListenerCallback = (evt: AgoraEduClassroomEvent, ...args: any[]) => void;

export enum AgoraEduClassroomEvent {
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

export declare type LanguageEnum = 'en' | 'zh';

export interface IAgoraWidget {
  widgetId: string;
  widgetDidLoad(dom: Element, widgetProps: any, sendMsg?: any, onReceivedMsg?: any): void;
  widgetWillUnload(): void;
}

export declare type LaunchMediaOptions = any & {
  lowStreamCameraEncoderConfiguration?: any;
};

export declare enum Platform {
  PC = 'PC',
  H5 = 'H5',
}

export interface IAgoraExtensionApp {
  type: AgoraExtensionAppTypeEnum;
  trackPath?: boolean;
  icon?: any;
  width: number;
  height: number;
  appIdentifier: string;
  appName: string;
  customHeader?: any;
  apply(stroe: any, extensionController: any): void;
  render(dom: HTMLElement): void;
  destory(): void;
}

export declare enum AgoraExtensionAppTypeEnum {
  'POPUP' = 'PUPUP',
  'PLUGININ' = 'PLUGININ',
}

/**
 * any 로 작성된 부분에 대해서 타입/ 인터페이스 정의 다시 해주기
 */
