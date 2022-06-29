interface IChooseForm {
  onLogin: () => void;
  setCurrentUser: (e: React.ChangeEvent<HTMLInputElement>) => void;
  user: string;
}

const ChooseForm = ({ onLogin, setCurrentUser, user }: IChooseForm) => {
  return (
    <div onChange={setCurrentUser}>
      <h3>Select User</h3>

      <label>
        <input type='radio' name='user' value='A' />
        <span>A</span>
      </label>
      <label>
        <input type='radio' name='user' value='B' />
        <span>B</span>
      </label>
      <label>
        <input type='radio' name='user' value='C' />
        <span>C</span>
      </label>

      <button disabled={!user} type='button' onClick={onLogin}>
        로그인
      </button>
    </div>
  );
};

export default ChooseForm;
