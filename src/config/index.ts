export const config = {
  APP_ID: process.env.REACT_APP_APP_ID,
  CHANNEL: process.env.REACT_APP_CHANNEL,
  TOKEN: process.env.REACT_APP_TOKEN,
};

// TOKEN 은 24시간 만료이므로 에러가 날 경우 재발급 받기

export const LIVE_CONFIG = {
  APP_ID: process.env.REACT_APP_LIVE_ID,
  CHANNEL: process.env.REACT_APP_LIVE_CHANNEL,
  TOKEN: process.env.REACT_APP_LIVE_TOKEN,
};
