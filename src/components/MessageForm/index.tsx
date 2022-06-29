interface IMessageForm {
  channelId: string;
  msgInput: string;
  onSend: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  scrollRef: React.LegacyRef<HTMLDivElement>;
  setMsgInput: (e: string) => void;
}

const MessageForm = ({ channelId, msgInput, onSend, scrollRef, setMsgInput }: IMessageForm) => (
  <div className='message-wrap'>
    <p>
      <span>In channel: {channelId}</span>
    </p>

    <div ref={scrollRef} className='conversation'></div>

    <form className='form-wrap' onSubmit={onSend}>
      <input type='text' value={msgInput} onChange={(e) => setMsgInput(e.target.value)} />
      <button type='submit'>전송</button>
    </form>
  </div>
);

export default MessageForm;
