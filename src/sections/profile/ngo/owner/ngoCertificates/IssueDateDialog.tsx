import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';
import { certificateUpdated, userCertificateSelector } from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';

function IssueDateDialog() {
  const userCertificate = useSelector(userCertificateSelector);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userCertificate) router.push(PATH_APP.profile.ngo.certificate.root);
  }, [userCertificate, router]);

  const handleChangeDatePicker = (value: Date) => {
    dispatch(
      certificateUpdated({
        issueDate: value,
        isChange: true,
      })
    );
    router.back();
  };

  return (
    <Dialog maxWidth="xs" open onClose={() => router.back()}>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
          <Icon name="left-arrow-1" />
        </IconButton>
        <Typography variant="subtitle1">Issue Date</Typography>
        {/* FIXME add primary variant to button variants */}
      </Stack>
      <Divider />
      <Box sx={{ p: 3 }}>
        <DatePicker
          maxDate={userCertificate?.expirationDate ? new Date(userCertificate?.expirationDate) : undefined}
          value={!userCertificate?.issueDate ? new Date(2020, 1) : new Date(userCertificate?.issueDate)}
          views={['month', 'year']}
          onChange={(date) => handleChangeDatePicker(date)}
        />
      </Box>
    </Dialog>
  );
}

export default IssueDateDialog;
