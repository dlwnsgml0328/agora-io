import { LocalInvitation, RtmStatusCode } from 'agora-rtm-sdk';
import { useEffect, useState } from 'react';

const useRTMLocalInvitation = (invitation: LocalInvitation) => {
  const [response, setResponse] = useState({ state: '', response: '' });

  const localInvitationReceivedByPeer = () => {
    console.log('@ localInvitationReceivedByPeer !');
    setResponse({ state: 'localInvitationReceivedByPeer', response: '' });
  };
  const localInvitationAccepted = (response: string) => {
    console.log('@ localInvitationAccepted !', response);
    setResponse({ state: 'localInvitationAccepted', response: response });
  };
  const localInvitationRefused = (response: string) => {
    console.log('@ localInvitationRefused !', response);
    setResponse({ state: 'localInvitationAccepted', response: response });
  };
  const localInvitationFailure = (response: RtmStatusCode.LocalInvitationFailureReason) => {
    console.log('@ localInvitationFailure !', response);
    setResponse({ state: 'localInvitationFailure', response: response });
  };
  const localInvitationCanceled = () => {
    console.log('@ localInvitationCanceled !');
    setResponse({ state: 'localInvitationCanceled', response: '' });
  };

  useEffect(() => {
    invitation.on('LocalInvitationReceivedByPeer', localInvitationReceivedByPeer);
    invitation.on('LocalInvitationAccepted', localInvitationAccepted);
    invitation.on('LocalInvitationRefused', localInvitationRefused);
    invitation.on('LocalInvitationFailure', localInvitationFailure);
    invitation.on('LocalInvitationCanceled', localInvitationCanceled);

    return () => {
      invitation.off('LocalInvitationReceivedByPeer', localInvitationReceivedByPeer);
      invitation.off('LocalInvitationAccepted', localInvitationAccepted);
      invitation.off('LocalInvitationRefused', localInvitationRefused);
      invitation.off('LocalInvitationFailure', localInvitationFailure);
      invitation.off('LocalInvitationCanceled', localInvitationCanceled);
    };
  }, [invitation]);

  return { response };
};

export default useRTMLocalInvitation;
