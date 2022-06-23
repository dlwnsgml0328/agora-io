import styled from 'styled-components';

export const RemoteMediaPlayerWrap = styled.div`
  margin-right: 10px;

  .video-player {
    width: 350px;
    height: 350px;
    background: #000;
  }

  @media screen and (max-width: 480px) {
    .video-player {
      margin: 0 auto;
      max-width: 350px;
      max-height: 350px;
      object-fit: contain;
    }
  }
`;
