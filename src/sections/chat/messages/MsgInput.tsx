import { useState, FC } from 'react';
import { Stack, TextField, useTheme } from '@mui/material';
import sendMsg from '/public/icons/chat/sendMsg.svg';
import Image from 'next/image';
import { styled } from '@mui/material/styles';

const ImageStyle = styled(Image)(({ theme }) => ({
  cursor: 'pointer',
}));

const MsgInput: FC<{ sendJsonMessage: (jsonMessage: any, keep?: boolean) => void; room: string }> = ({
  sendJsonMessage,
  room,
}) => {
  const [msg, setMsg] = useState<string>('');
  const theme = useTheme();

  const handleClickSendMessage = () => {
    sendJsonMessage({
      action: 'sendMessage',
      room_id: room,
      type: 'text',
      text_content: msg,
      operation: 'create',
      message_id: '',
    });
    setMsg('');
  };

  return (
    <Stack direction="row" sx={{ width: '100%', padding: theme.spacing(0.62), justifyContent: 'space-around' }}>
      <TextField
        sx={{ width: '92%' }}
        id="msg-input-multiline"
        label="Text Message"
        multiline
        maxRows={5}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <ImageStyle src={sendMsg} alt="send" onClick={handleClickSendMessage} />
    </Stack>
  );
};

export default MsgInput;
