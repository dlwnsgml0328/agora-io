declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string;
  }
}

declare global {
  interface Window {
    AgoraEduSDK: any;
  }
}
