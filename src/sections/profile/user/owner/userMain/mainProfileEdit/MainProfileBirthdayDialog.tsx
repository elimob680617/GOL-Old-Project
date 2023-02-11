import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DatePicker from 'src/components/DatePicker';
import { updateMainInfo, userMainInfoSelector } from 'src/redux/slices/profile/userMainInfo-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';

function MainProfileBirthdayDialog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userMainInfo = useSelector(userMainInfoSelector);

  useEffect(() => {
    if (!userMainInfo) router.push(PATH_APP.profile.user.userEdit);
  }, [userMainInfo, router]);

  const handleChange = (date: Date) => {
    dispatch(
      updateMainInfo({
        birthday: date,
      })
    );
    router.back();
  };

  return (
    <Dialog maxWidth="xs" open onClose={() => router.back()}>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
          <ArrowLeft />
        </IconButton>
        <Typography variant="subtitle1">Birthday</Typography>
      </Stack>
      <Divider />

      <Box sx={{ p: 3 }}>
        <DatePicker
          maxDate={new Date(new Date().getFullYear() - 13, 1, 1)}
          minDate={new Date(new Date().getFullYear() - 89, 1)}
          value={
            userMainInfo?.birthday ? new Date(userMainInfo?.birthday) : new Date(new Date().getFullYear() - 15, 1, 1)
          }
          onChange={handleChange}
        />
      </Box>
    </Dialog>
  );
}

export default MainProfileBirthdayDialog;
