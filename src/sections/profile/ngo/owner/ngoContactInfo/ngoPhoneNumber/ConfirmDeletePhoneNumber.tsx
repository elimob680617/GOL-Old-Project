import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { phoneNumberAdded } from 'src/redux/slices/profile/userPhoneNumber-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';

function ConfirmDeletePhoneNumber() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClickDeleteButton = async () => {
    router.push(PATH_APP.profile.ngo.contactInfo.phoneNumber.confirm);
    // await sleep(1500);
    // dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Are you sure to delete this Phone Number?
            </Typography>
          </Box>
          <Link href={PATH_APP.profile.ngo.contactInfo.root} passHref>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
            <Icon name="trash" color="error.main" />
            <Box>
              <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
                Delete Phone number
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
            <Icon name="Close-1" />
            <Link href="/profile/contact-info/" passHref>
              <Typography variant="body2" color="text.primary">
                Discard
              </Typography>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ConfirmDeletePhoneNumber;
