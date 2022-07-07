import styled from 'styled-components';

export const LoginWrap = styled.div`
  input {
    vertical-align: middle;
    margin-right: 5px;
  }

  .input-radio {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .info {
    margin-top: 2%;
  }

  .enter-btn:disabled {
    background: #7a7a7a;
    cursor: not-allowed;
  }
`;

export const EazelWrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  .eazel-iframe {
    width: 80%;
  }

  .eazel-chat {
    width: 20%;
  }

  #launch-dom {
    height: 100%;
  }

  @media screen and (max-width: 480px) {
    overflow-y: scroll;
    flex-wrap: wrap;

    .eazel-iframe {
      display: none;
    }

    .eazel-chat {
      width: 100%;
    }

    #launch-dom {
      min-height: 1200px;

      .video-player-overlay .video-player {
        width: 380px !important;
        height: 200px !important;
      }

      .chat-panel {
        height: 80%;
      }
      #netless-white {
        flex-direction: row;
      }
    }
  }
`;

export const LoadingWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    font-weight: 400;
    font-size: initial;
  }

  .pro {
    height: 10px;
    width: 100%;
    max-width: 500px;
    border-radius: 20px;

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

  @media screen and (max-width: 480px) {
    .pro {
      max-width: 200px;
    }
  }
`;
