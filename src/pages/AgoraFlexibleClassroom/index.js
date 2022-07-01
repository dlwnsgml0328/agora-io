import { useEffect, useState } from 'react';

const AgoraFlexibleClassroom = () => {
  const [load, setLoad] = useState(false);
  useEffect(() => {
    isScript('https://download.agora.io/edu-apaas/release/edu_sdk@2.4.3.bundle.js');

    console.log('done');

    setTimeout(() => {
      setLoad(true);
    }, 0);
  }, []);

  const isScript = (url) => {
    if (Array.from(document.scripts).some((script) => script.src === url)) return;

    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    document.body.appendChild(script);
  };

  const launchClassroom = () => {
    window.AgoraEduSDK.config({
      appId: '8a23d043d1f2493b9e50b358002542c7',
      region: 'NA',
    });

    // Launch a classroom
    window.AgoraEduSDK.launch(document.querySelector(`.launch-button`), {
      rtmToken:
        '0068a23d043d1f2493b9e50b358002542c7IACtW/ZaDfOy80n3V37KL5Ileorva5Ls3jKxY3UctR3ZpdWm9rAAAAAAEABNJ9Z+bfi/YgEA6ANt+L9i',
      userUuid: 'teacher',
      userName: 'teacher',
      roomUuid: '433',
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
  };

  return (
    <div>
      <h3>Flexible Classroom</h3>
      <button
        type='button'
        disabled={!load}
        onClick={() => launchClassroom()}
        style={{ border: '1px solid black', padding: 5, borderRadius: 10, cursor: 'pointer' }}
      >
        launch
      </button>
      <div className='launch-button'></div>
    </div>
  );
};

export default AgoraFlexibleClassroom;
