import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { updateMainInfo } from 'src/redux/slices/profile/userMainInfo-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';

interface MainProfileChangePhotoDialogProps {
  isProfilePhoto?: boolean;
}

function MainProfileChangePhotoDialog(props: MainProfileChangePhotoDialogProps) {
  const { isProfilePhoto = false } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  function handleRemove() {
    if (isProfilePhoto)
      dispatch(
        updateMainInfo({
          avatarUrl: undefined,
        })
      );
    else
      dispatch(
        updateMainInfo({
          coverUrl: undefined,
        })
      );
    router.back();
  }

  return (
    <Dialog fullWidth={true} open={true} keepMounted>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Change {isProfilePhoto ? 'Profile' : 'Cover'} photo
            </Typography>
          </Box>
          {/* <IconButton onClick={() => router.back()}>
            <CloseSquare />
          </IconButton> */}
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Link
            href={isProfilePhoto ? PATH_APP.profile.user.userEditAvatar : PATH_APP.profile.user.userEditCover}
            passHref
          >
            <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
              <Image width={20} height={20} src={'/icons/upload_photo.svg'} alt="upload" />
              <Typography variant="body2">Upload From System</Typography>
            </Box>
          </Link>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleRemove}>
            <Image width={20} height={20} src={'/icons/delete_photo.svg'} alt="remove" />
            <Typography variant="body2" color="error">
              Remove Photo
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default MainProfileChangePhotoDialog;
