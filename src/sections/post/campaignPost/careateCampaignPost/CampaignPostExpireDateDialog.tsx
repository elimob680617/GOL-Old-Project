import { Box, Dialog, DialogProps, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState, FC } from 'react';
import DatePicker from 'src/components/DatePicker';
import dayjs from 'dayjs';

interface ICampaignPostExpireDateDialogProps extends DialogProps {
  value: Date | null;
}

const CampaignPostExpireDateDialog: FC<ICampaignPostExpireDateDialogProps> = (props) => {
  const { value, open, onClose } = props;
  const [expireDate, setExpireDate] = useState<Date | null>(value ? value : null);

  const handleChange = (date: Date) => {
    setExpireDate(date);
    handleClose(date);
  };

  const handleClose = (date?: Date) => {
    onClose!(date || {}, 'backdropClick');
  };

  useEffect(() => {
    // if (!value) return;
    setExpireDate(value);
  }, [value]);

  return (
    <Dialog maxWidth="xs" open={open} onClose={() => handleClose()}>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" justifyContent="space-between" alignItems="center">
        {/* <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
          <ArrowLeft />
        </IconButton> */}
        <Typography variant="subtitle1">Select Deadline</Typography>
        <IconButton sx={{ p: 0 }} onClick={() => handleClose()}>
          <img width={24} height={24} src="/icons/Close/24/close.svg" alt="" />
        </IconButton>
      </Stack>
      <Divider />

      <Box sx={{ p: 3 }}>
        <DatePicker
          value={expireDate || undefined}
          minDate={new Date()}
          maxDate={dayjs().add(365, 'day').toDate()}
          views={['month', 'year', 'day']}
          onChange={handleChange}
        />
      </Box>
    </Dialog>
  );
};

export default CampaignPostExpireDateDialog;
