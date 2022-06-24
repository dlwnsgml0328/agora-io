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
          <Link to='/CreateRemoteTracks-v2'>Create Remote Tracks V2 🔥</Link>
        </li>
        <li>
          <Link to='/create-interactive-live-streaming'>Create Interactive live streaming 🖥</Link>
        </li>
        <li>
          <Link to='/RTCQuickStart'>RTC quick start 🔥</Link>
        </li>
      </ul>
    </S.Header>
  );
};

export default Header;
