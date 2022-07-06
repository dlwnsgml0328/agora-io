import { Link } from 'react-router-dom';
import * as S from './index.styles';

const Header = () => {
  return (
    <S.Header>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        {/*<li>
          <Link to='/CreateRemoteTracks-v2'>Create Remote Tracks V2 🔥</Link>
        </li>
        <li>
          <Link to='/create-interactive-live-streaming'>Create Interactive live streaming 🖥</Link>
        </li>
        <li>
          <Link to='/RTCQuickStart'>RTC quick start 🔥</Link>
        </li>
        <li>
          <Link to='/RTMQuickStart'>RTM quick start (channel) 🔥</Link>
        </li>
        <li>
          <Link to='/RTMPeerToPeer'>RTM peer to peer (1:1) 🔥</Link>
        </li>
        <li>
          <Link to='/RTMCallInvitation'>RTM call invitation 🤙🏼</Link>
        </li>
        <li>
          <Link to='/RTMFeatureChannel'>RTM feature channel 🚀</Link>
        </li> */}
        <li>
          <Link to='/Agora-flexible-classroom'>Flexible Classroom 👨🏻‍🏫</Link>
        </li>
      </ul>
    </S.Header>
  );
};

export default Header;
