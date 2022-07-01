var launchOption = {};

console.log('AgoraEduSDK:', window.AgoraEduSDK);

window.AgoraEduSDK.config({
  appId: '8a23d043d1f2493b9e50b358002542c7',
  region: 'NA',
});

// Launch a classroom
window.AgoraEduSDK.launch(document.querySelector(`#launch-button`), {
  rtmToken:
    '0068a23d043d1f2493b9e50b358002542c7IACtW/ZaDfOy80n3V37KL5Ileorva5Ls3jKxY3UctR3ZpdWm9rAAAAAAEABNJ9Z+bfi/YgEA6ANt+L9i',
  userUuid: 'teacher',
  userName: 'teacher',
  roomUuid: '43212',
  roleType: 1,
  roomType: 4,
  roomName: 'demo-class',
  pretest: false,
  language: 'en',
  startTime: new Date().getTime(),
  duration: 60 * 30,
  courseWareList: [],
  listener: (evt) => {
    console.log('evt', evt);
  },
});
