import styled from 'styled-components';

export const CallInvitationWrap = styled.div`
  width: 100%;
  height: 100%;
`;

export const InvitationModalWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #004ec7;

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    box-shadow: 0 2px 7px rgba(0, 0, 0, 0.3);

    padding: 20px 40px;
    background-color: #fff;

    h3 {
      text-align: center;
      font-weight: bold;
    }

    .exit {
      position: absolute;
      right: 20px;

      cursor: pointer;
    }

    .button-group {
      display: flex;
      width: 100%;
      justify-content: space-around;
      align-items: center;

      button {
        min-width: 70px;
        width: 30%;
        background-color: #004ec7;
        color: #fff;
        border: none;
        border-radius: 20px;
        padding: 10px 0;

        cursor: pointer;
      }
    }
  }
`;
