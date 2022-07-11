import styled from 'styled-components';

export const MessageWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 20px;
  border: 0.1px solid #000;
  height: 50vh;
  padding: 20px;

  background-color: #004ec7;

  ul {
    margin: 0;
    padding-left: 0;
  }

  li {
    list-style: none;
  }

  .conversation {
    overflow-y: auto;
    border: 0.1px solid black;
    height: 45vh;
    background-color: #fff;
    margin-top: 10px;

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
`;
