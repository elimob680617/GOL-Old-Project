import { useState } from 'react';
import { Avatar, Button, IconButton, Stack, Typography, useTheme } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'src/redux/store';
import { onEnable, onDisable } from 'src/redux/slices/chat/selectMsgReducer';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import DeleteModal from './DeleteModal';

const MoreIcon = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'inherit !important',
}));

const ChatHeader = () => {
  const { isSelect } = useSelector((state) => state.selectMsg);
  const { onChatUser } = useSelector((state) => state.selectedUser);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('username@gmail.com');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };
  return (
    <>
      <Stack direction="row" sx={{ justifyContent: 'space-between', padding: theme.spacing(2) }}>
        <Stack direction="row" spacing={3}>
          <Avatar
            sx={{ height: 48, width: 48 }}
            aria-label="avatar"
            src={onChatUser.avatarUrl || undefined}
            alt="user"
          />
          <Stack>
            <Typography gutterBottom variant="subtitle2" component="div" sx={{ margin: theme.spacing(0) }}>
              {onChatUser.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {onChatUser.userName}
            </Typography>
          </Stack>
        </Stack>
        {isSelect ? (
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            <Typography color="text.primary" variant="subtitle1">
              Selected
            </Typography>
            <Button variant="outlined" startIcon={<DeleteForeverRoundedIcon />} onClick={handleClickOpen}>
              <Typography variant="overline">Delete</Typography>
            </Button>
            <MoreIcon onClick={() => dispatch(onDisable())}>
              <ClearRoundedIcon />
            </MoreIcon>
          </Stack>
        ) : (
          <MoreIcon onClick={() => dispatch(onEnable())}>
            <MoreVertOutlinedIcon />
          </MoreIcon>
        )}
      </Stack>
      <DeleteModal selectedValue={selectedValue} open={open} onClose={handleClose} />
    </>
  );
};

export default ChatHeader;
