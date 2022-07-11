import styled from 'styled-components';
import { pallette } from '../../style/pallette';

export const ChannelWrap = styled.div`
  display: flex;
  margin-top: 20px;
  height: 70vh;

  .message-wrap {
    display: flex;
    flex-direction: column;

    min-width: 200px;
    width: 80%;
    height: 100%;
    padding: 20px;

    background-color: ${pallette.channel.blue01};

    p {
      margin: 0;
      height: 32px;
      line-height: 32px;

      span {
        color: ${pallette.span.white};
      }
    }

    ul {
      margin: 0;
      padding-left: 0;
    }

    li {
      list-style: none;
    }

    .conversation {
      overflow-y: auto;
      height: 90%;
      background-color: #fff;

      .local,
      .remote {
        margin-top: 10px;
        vertical-align: middle;
      }

      .local {
        margin-right: 10px;
        text-align: right;

        .uid {
          background-color: #383838;
        }

        .msg {
          background: #004ec7;
          color: white;
        }
      }

      .remote {
        margin-left: 10px;
        text-align: left;

        .uid {
          background-color: #ebebeb;
        }

        .msg {
          background: #ebebeb;
          color: #000;
        }
      }

      .uid {
        display: inline-block;
        margin-right: 10px;

        width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 20%;
        vertical-align: sub;
        overflow: hidden;
        text-align: center;
      }
      .msg {
        display: inline-block;
        width: auto;
        height: 15px;
        line-height: 15px;
        border-radius: 10px;
        padding: 10px;
      }
    }

    .form-wrap {
      display: flex;

      input {
        width: 100%;
      }
      button {
        width: 100%;
        max-width: 60px;
        margin-right: 0;
      }
    }
  }

  .channel-user-wrap {
    width: 20%;
    height: 100%;
    padding: 20px;
    background: ${pallette.channel.blue02};

    p {
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        color: ${pallette.span.white};
      }
    }

    ul {
      margin: 0;
      border: 1px solid black;
      height: 90%;
      padding-left: 0;
      overflow: auto;
      background: #fff;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 10px 0 10px;
      list-style: none;
    }

    .invite {
      border: none;
      background: none;
      cursor: pointer;
    }

    .you {
      color: #004ec7;
    }

    .online {
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 50%;

      background: #66ff1f;

      box-shadow: 0 0px 5px rgba(0, 0, 0, 0.3);
    }
  }

  .invite-modal-wrap {
    position: absolute;
    right: 0;
    width: 20%;
    height: 70vh;
    padding: 20px;
    background: ${pallette.channel.blue03};
    color: ${pallette.span.dark};

    p {
      display: flex;
      justify-content: space-between;
      margin: 0;
      height: 32px;
      line-height: 32px;
    }
    .title {
      width: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .exit {
      cursor: pointer;
    }

    ul {
      margin: 0;
      border: 1px solid black;
      height: 90%;
      padding-left: 0;
      overflow: auto;
      background: #fff;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 10px 0 10px;
      list-style: none;
    }

    .search-wrap {
      display: flex;

      input {
        width: 100%;
      }

      button {
        min-width: 40px;
      }
    }
  }

  @media screen and (max-width: 480px) {
    .message-wrap {
      background: orange;
    }
    .channel-user-wrap {
      background-color: #004ec7;
    }
    .invite-modal-wrap {
      background-color: #525252;
    }
  }
`;
