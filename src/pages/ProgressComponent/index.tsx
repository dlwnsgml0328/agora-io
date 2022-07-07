import React, { useState } from 'react';
import styled from 'styled-components';

const ProgressComponent = () => {
  const [rate, setRate] = useState(0);
  const [downloadDone, setDonwloadDone] = useState(false);
  function download() {
    var xhr = new XMLHttpRequest();

    xhr.onload = (e) => {
      console.log('upload complete', e);
      setDonwloadDone(true);
    };
    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        console.log('e.loaded, e.total', e.loaded, e.total);
        var percentComplete = Math.floor((e.loaded / e.total) * 100);
        console.log('@ percentComplete', percentComplete);
        setRate(percentComplete);
      } else {
      }
    };
    xhr.onabort = () => {
      console.error('Upload cancelled.');
    };

    // xhr.open('GET', process.env.PUBLIC_URL + '/bundle/edu_sdk.bundle.js');

    xhr.open(
      'GET',
      'https://eazel-io.s3.ap-northeast-2.amazonaws.com/uploads/immsi/edu_sdk.bundle.js'
    );

    xhr.send();
  }
  return (
    <ProgressWrap>
      <div>
        <h1>Hello Progress</h1>

        <progress max={100} value={rate} />

        <button type='button' onClick={download}>
          download
        </button>
      </div>
      {downloadDone && (
        <div>
          <h1>Welcome</h1>
        </div>
      )}
    </ProgressWrap>
  );
};

export default ProgressComponent;

const ProgressWrap = styled.div`
  progress {
    border-radius: 20px;
    height: 10px;
    width: 100%;
    margin-right: 20px;
    max-width: 500px;

    -webkit-appearance: none;

    ::-webkit-progress-bar {
      background-color: grey;
      border-radius: 20px;
    }

    ::-webkit-progress-value {
      background-color: #88beff;
      border-radius: 20px;
    }
  }
`;
