import { RemoteInvitation } from 'agora-rtm-sdk';
import * as S from './index.style';

interface IInvitationModal {
  acceptInvitation: () => Promise<void>;
  refuseInvitation: () => void;
  remoteInvitation: RemoteInvitation | undefined;
}

const InvitationModal = ({
  acceptInvitation,
  refuseInvitation,
  remoteInvitation,
}: IInvitationModal) => (
  <S.InvitationModalWrap>
    <div className='modal'>
      <span className='exit' onClick={() => refuseInvitation()}>
        X
      </span>
      <h3>Invitation</h3>

      <p>초대한 인원: {remoteInvitation!.callerId}</p>
      <p>초대한 채널: {remoteInvitation?.channelId || '없음'}</p>
      <p>컨텐츠: {remoteInvitation?.content || '없음'}</p>

      <div className='button-group'>
        <button type='button' onClick={acceptInvitation}>
          수락
        </button>
        <button type='button' onClick={refuseInvitation}>
          거절
        </button>
      </div>
    </div>
  </S.InvitationModalWrap>
);

export default InvitationModal;
