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
    border: 0.1px solid black;
    border-radius: 20px;
    box-shadow: 0 2px 7px rgba(0, 0, 0, 0.3);

    padding: 20px 40px;
    background-color: #fff;

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
    }
  }
`;
