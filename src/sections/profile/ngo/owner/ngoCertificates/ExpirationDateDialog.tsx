import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Scalars } from 'src/@types/sections/serverTypes';
import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';
import { certificateUpdated, userCertificateSelector } from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';

function ExpirationDateDialog() {
  const userCertificate = useSelector(userCertificateSelector);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!userCertificate) router.push(PATH_APP.profile.ngo.certificate.root);
  }, [userCertificate, router]);

  const handleChangeDatePicker = (value: Scalars['DateTime']) => {
    dispatch(
      certificateUpdated({
        expirationDate: value,
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
        <Typography variant="subtitle1">ExpirationDate Date</Typography>
        {/* FIXME add primary variant to button variants */}
      </Stack>
      <Divider />

      <Box sx={{ p: 3 }}>
        <DatePicker
          value={!userCertificate?.expirationDate ? new Date(2020, 1) : new Date(userCertificate?.expirationDate)}
          minDate={userCertificate?.issueDate ? new Date(userCertificate?.issueDate) : undefined}
          views={['month', 'year']}
          onChange={(date) => handleChangeDatePicker(date)}
        />
      </Box>
    </Dialog>
  );
}

export default ExpirationDateDialog;
