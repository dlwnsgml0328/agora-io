import styled from 'styled-components';

export const Header = styled.div`
  ul {
    padding-left: 0;
    display: flex;
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
`;
