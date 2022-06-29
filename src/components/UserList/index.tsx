interface IUserList {
  config: {
    uid: string;
    token: string;
  };
  memberList: string[];
  setInviteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserList = ({ config, memberList, setInviteModal }: IUserList) => (
  <div className='channel-user-wrap'>
    <p>
      <span>user list</span>

      <button type='button' className='invite' onClick={() => setInviteModal(true)}>
        ⚙️
      </button>
    </p>
    <ul>
      {memberList.map((member, idx) => (
        <li key={idx}>
          <span className={member === config.uid ? 'you' : undefined}>
            {member} {member === config.uid ? '🧑🏻‍💻' : '👩🏻‍💻'}
          </span>
          <span className='online'></span>
        </li>
      ))}
    </ul>
  </div>
);

export default UserList;
