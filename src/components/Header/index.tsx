import { Link } from 'react-router-dom';
import * as S from './index.styles';

const Header = () => {
  return (
    <S.Header>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        {/* REACT_APP_APP_ID */}
        <li>
          <Link to='/rtc-trac'>RTC Track 🔥</Link>
        </li>
        {/* REACT_APP_LIVE_ID */}
        <li>
          <Link to='/interactive-live-streaming'>Interactive live streaming 🖥</Link>
        </li>
        {/* REACT_APP_RTM_ID */}
        <li>
          <Link to='/rtm-channel'>RTM Channel 🔥</Link>
        </li>
        <li>
          <Link to='/rtm-peer-to-peer'>RTM peer to peer (1:1) 🔥</Link>
        </li>
        <li>
          <Link to='/rtm-call-invitation'>RTM call invitation 🤙🏼</Link>
        </li>
        <li>
          <Link to='/rtm-integration'>RTM integration channel 🚀</Link>
        </li>
        {/* REACT_APP_LIVE_ID/TEACHER/STU1/STU2 */}
        <li>
          <Link to='/progress'>Progress state 📶</Link>
        </li>
        <li>
          <Link to='/Agora-flexible-classroom'>Flexible Classroom 👨🏻‍🏫</Link>
        </li>
      </ul>
    </S.Header>
  );
};

export default Header;
