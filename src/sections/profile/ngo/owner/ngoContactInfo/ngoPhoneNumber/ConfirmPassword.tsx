import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'src/components/Icon';
import { phoneNumberCleared, userPhoneNumberSelector } from 'src/redux/slices/profile/userPhoneNumber-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useRemovePhoneNumberMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/removePhoneNumber.generated';

function ConfirmPassword() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userPhoneNumber = useSelector(userPhoneNumberSelector);
  const { enqueueSnackbar } = useSnackbar();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [deleteUserPhoneNumber, { isLoading }] = useRemovePhoneNumberMutation();

  const handleDeletePhoneNumber = async () => {
    const resDataDelete: any = await deleteUserPhoneNumber({
      filter: {
        dto: {
          id: userPhoneNumber?.id,
          password: password,
        },
      },
    });
    if (resDataDelete.data.deletePhoneNumber?.isSuccess) {
      dispatch(phoneNumberCleared());
      router.push(PATH_APP.profile.ngo.contactInfo.root);
      enqueueSnackbar('The phone number has been successfully deleted', { variant: 'success' });
      await sleep(1500);
      dispatch(phoneNumberCleared());
    }
    // else {
    //   enqueueSnackbar(resDataDelete.data.deletePhoneNumber?.messagingKey, { variant: 'error' });
    // }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Delete Phone Number
            </Typography>
          </Box>
          <IconButton onClick={() => router.back()}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" color="text.primary" sx={{ mt: 4 }}>
              Are you sure you want to remove this phone number address? To save this setting, please enter your Garden
              of Love password.
            </Typography>
          </Box>
          <TextField
            placeholder="Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <Icon name="Eye" /> : <Icon name="Eye-Hidden" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            loading={isLoading}
            color="primary"
            variant="contained"
            onClick={() => handleDeletePhoneNumber()}
          >
            Confirm
          </LoadingButton>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ConfirmPassword;
