import { FC } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Dialog, Button } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'inherit !important',
  color: '#BF283A',
}));

const DeleteModal: FC<{ open: boolean; selectedValue: string; onClose: (value: string) => void }> = ({
  open,
  selectedValue,
  onClose,
}) => {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <StyledButton variant="text" onClick={() => handleListItemClick('a')}>
        <Typography variant="overline">Delete for me & Panda</Typography>
      </StyledButton>
      <StyledButton variant="text" onClick={() => handleListItemClick('b')}>
        <Typography variant="overline">Delete for me</Typography>
      </StyledButton>
    </Dialog>
  );
};

export default DeleteModal;
