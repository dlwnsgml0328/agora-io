import { IresultUserList } from '../../../pages/RTMIntegration';

interface IUserListInviteModal {
  exitModal: () => void;
  onInvite: (calleeId: string) => void;
  onSubmitSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  resultUserList: IresultUserList[];
  searchUser: string;
  setSearchUser: React.Dispatch<React.SetStateAction<string>>;
}

const UserListInviteModal = ({
  exitModal,
  onInvite,
  onSubmitSearch,
  resultUserList,
  searchUser,
  setSearchUser,
}: IUserListInviteModal) => (
  <div className='invite-modal-wrap'>
    <p>
      <span className='title'>invite user</span>

      <span className='exit' onClick={() => exitModal()}>
        X
      </span>
    </p>

    <ul>
      {resultUserList.map((user, idx: number) => (
        <li key={idx}>
          <span>{user.id}</span>
          <button disabled={!user.canInvite} type='button' onClick={() => onInvite(user.id)}>
            초대
          </button>
        </li>
      ))}
    </ul>

    <form className='search-wrap' onSubmit={onSubmitSearch}>
      <input
        type='text'
        value={searchUser}
        placeholder='ex) 0328'
        onChange={(e) => setSearchUser(e.target.value)}
      />
      <button type='submit'>검색</button>
    </form>
  </div>
);

export default UserListInviteModal;
