import * as S from './index.styles';
const NotFound = () => {
  return (
    <S.NotFoundWrap>
      <h1>Oops, page not found</h1>

      <button onClick={() => window.history.go(-1)}>back</button>
      <button onClick={() => (window.location.href = '/')}>home</button>
    </S.NotFoundWrap>
  );
};

export default NotFound;
