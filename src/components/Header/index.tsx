import { Link } from 'react-router-dom';
import * as S from './index.styles';

const Header = () => {
  return (
    <S.Header>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/JoinAndLeave'>Join And Leave</Link>
        </li>
        <li>
          <Link to='/CreateLocalTracks'>Create Local Tracks</Link>
        </li>
        <li>
          <Link to='/CreateRemoteTracks'>Create Remote Tracks</Link>
        </li>
        <li>
          <Link to='/PublishAndSubscribe'>Publish And Subscribe</Link>
        </li>
        <li>
          <Link to='/AdjustVolume'>Adjust Volume</Link>
        </li>
      </ul>
    </S.Header>
  );
};

export default Header;
