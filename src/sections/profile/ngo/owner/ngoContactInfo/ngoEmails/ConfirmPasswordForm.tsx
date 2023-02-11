import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { emptyEmail, userEmailsSelector } from 'src/redux/slices/profile/contactInfo-slice-eli';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useDeleteUserEmailMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/deleteUserEmail.generated';

function ConfirmPassword() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const personEmail = useSelector(userEmailsSelector);
  const [valid, setValid] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [deleteUserEmail, { isLoading }] = useDeleteUserEmailMutation();

  const handleDeleteEmail = async () => {
    const resDataDelete: any = await deleteUserEmail({
      filter: {
        dto: {
          id: personEmail?.id,
          password: password,
        },
      },
    });

    if (resDataDelete.data.deleteUserEmail?.isSuccess) {
      router.push(PATH_APP.profile.ngo.contactInfo.root);
      enqueueSnackbar('The Email has been successfully deleted', { variant: 'success' });
      await sleep(1000);
      dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    }

    if (!resDataDelete.data.deleteUserEmail?.isSuccess) {
      enqueueSnackbar(resDataDelete.data.deleteUserEmail?.messagingKey, { variant: 'error' });
    }
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
              Delete Email
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
              Are you sure you want to remove this email address? To save this setting, please enter your Garden of Love
              password.
            </Typography>
          </Box>
          <TextField
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
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
            fullWidth
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            loading={isLoading}
            onClick={() => handleDeleteEmail()}
            disabled={password.length ? !valid : valid}
            sx={{ maxHeight: '40px' }}
          >
            Confirm
          </LoadingButton>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ConfirmPassword;
