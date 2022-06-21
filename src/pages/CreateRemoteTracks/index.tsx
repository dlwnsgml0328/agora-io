import { useState } from 'react';
import Login from '../../components/Login';

const CreateRemoteTracks = () => {
  const [auth, setAuth] = useState(false);
  return (
    <div>
      <h3>Create Remote Tracks</h3>

      {!auth ? <Login setAuth={setAuth} /> : <div>Welcome!</div>}
    </div>
  );
};

export default CreateRemoteTracks;
