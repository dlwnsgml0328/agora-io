declare namespace NodeJS {
  interface Process {
    REACT_APP_APP_ID: string;
    REACT_APP_CHANNEL: string;
    REACT_APP_TOKEN: string;
  }
  interface ProcessEnv {
    [key: string]: string;
  }
}
