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
      </ul>
    </S.Header>
  );
};

export default Header;
