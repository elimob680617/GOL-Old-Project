import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { experienceAdded } from 'src/redux/slices/profile/userExperiences-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';

function ExperienceEditPhotoDialog() {
  const dispatch = useDispatch();
  const router = useRouter();

  // function !
  function handleRemove() {
    dispatch(
      experienceAdded({
        mediaUrl: undefined,
        isChange: true,
      })
    );
    router.push(PATH_APP.profile.user.experience.add);
  }
  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Edit Photo
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={1} sx={{ px: 2 }}>
          <Link href={PATH_APP.profile.user.experience.photo} passHref>
            <LoadingButton
              startIcon={<Image width={20} height={20} src={'/icons/upload_photo.svg'} alt="upload" />}
              variant="text"
              color="inherit"
              sx={{ maxWidth: 250 }}
            >
              <Typography variant="body2" color="text.primary">
                Upload New Photo From System
              </Typography>
            </LoadingButton>
          </Link>
          <Button
            variant="text"
            color="error"
            startIcon={<Image width={20} height={20} src={'/icons/delete_photo.svg'} alt="remove" />}
            onClick={handleRemove}
            sx={{ maxWidth: 140 }}
          >
            <Typography variant="body2" color="error">
              Remove Photo
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ExperienceEditPhotoDialog;
