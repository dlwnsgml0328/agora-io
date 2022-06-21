import styled from 'styled-components';

export const Header = styled.div`
  ul {
    display: flex;
    align-items: center;
    padding-left: 0;
  }

  li {
    list-style: none;
    margin-right: 1%;
  }

  a {
    text-decoration: none;
    font-weight: 300;
    color: #000;

    transition: all ease-in-out 200ms;

    cursor: pointer;

    :hover {
      font-weight: bold;
    }
  }

  @media screen and (max-width: 480px) {
    ul {
      overflow-y: auto;
      flex-wrap: wrap;
      margin: 10px;
      height: 140px;
    }

    li {
      margin-bottom: 10px;
      border-bottom: 1px solid #000;
      width: 100%;
    }

    a {
      font-size: 5vw;
    }
  }
`;
