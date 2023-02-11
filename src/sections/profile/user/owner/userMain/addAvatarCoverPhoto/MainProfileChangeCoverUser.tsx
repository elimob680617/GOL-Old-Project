//mui
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
//iconSax
import { ArrowLeft } from 'iconsax-react';
//next
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
//icon
import Remove from 'public/icons/mainNGO/remove image, remove photo/Vector.png';
import Update from 'public/icons/mainNGO/upload image/Vector.png';
//...
import React from 'react';
//routes
import { PATH_APP } from 'src/routes/paths';

interface MainProfileChangePhotoDialogProps {
  isProfilePhoto?: boolean;
}
function MainProfileChangeCoverUser(props: MainProfileChangePhotoDialogProps) {
  const { isProfilePhoto = false } = props;
  const router = useRouter();

  const handleRemove = async () => {
    if (isProfilePhoto) {
      router.push(PATH_APP.profile.user.mainProfileDeleteAvatar);
    } else {
      router.push(PATH_APP.profile.user.mainProfileDeleteCover);
    }
  };

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
            href={
              isProfilePhoto
                ? PATH_APP.profile.user.mainProfileAddAvatarUser
                : PATH_APP.profile.user.mainProfileAddCoverUser
            }
            passHref
          >
            <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
              <Image width={20} height={20} src={Update} alt="upload" />
              <Typography variant="body2">Upload From System</Typography>
            </Box>
          </Link>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleRemove}>
            <Image width={20} height={20} src={Remove} alt="remove" />
            <Typography variant="body2" color="error">
              Remove Photo
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default MainProfileChangeCoverUser;
