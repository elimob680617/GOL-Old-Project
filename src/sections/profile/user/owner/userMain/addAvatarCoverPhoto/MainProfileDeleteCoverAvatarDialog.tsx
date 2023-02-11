//mui
import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
//iconSax
import { ArrowLeft, CloseSquare } from 'iconsax-react';
//next
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
//icon
import Close from 'public/icons/mainNGO/Close/24/Outline.png';
import Remove from 'public/icons/mainNGO/Trash/24/Group 184.png';
//...
import React from 'react';
import { ProfileFieldEnum } from 'src/@types/sections/serverTypes';
import useAuth from 'src/hooks/useAuth';
//routes
import { PATH_APP } from 'src/routes/paths';
//service
import { useUpdateProfileFiledMutation } from 'src/_requests/graphql/profile/mainProfile/mutations/updatePersonProfile.generated';

interface MainProfileChangePhotoDialogProps {
  isProfilePhoto?: boolean;
}
function MainProfileDeleteCoverAvatarDialog(props: MainProfileChangePhotoDialogProps) {
  const { initialize } = useAuth();

  const [updateProfileField, { isLoading: isLoadingField }] = useUpdateProfileFiledMutation();

  const { isProfilePhoto = false } = props;
  const router = useRouter();

  const handleRemove = async () => {
    if (isProfilePhoto) {
      const res: any = await updateProfileField({
        filter: {
          dto: {
            field: ProfileFieldEnum.AvatarUrl,
            avatarUrl: null,
          },
        },
      });
      if (res?.data?.updateProfileFiled?.isSuccess) initialize();
    } else {
      await updateProfileField({
        filter: {
          dto: {
            field: ProfileFieldEnum.CoverUrl,
            coverUrl: null,
          },
        },
      });
    }
    router.push(PATH_APP.profile.user.root);
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
              {isProfilePhoto ? 'Do you want delete avatar Photo?' : 'Do you want delete Cover Photo?'}
            </Typography>
          </Box>
          <IconButton onClick={() => router.back()}>
            <CloseSquare />
          </IconButton>
        </Stack>
        <Divider />
        <Stack sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
            <LoadingButton
              onClick={handleRemove}
              loading={isLoadingField}
              startIcon={<Image width={20} height={20} src={Remove} alt="remove" />}
            >
              <Typography variant="body2" color="error">
                Delete Photo
              </Typography>
            </LoadingButton>
          </Box>
          <Link href={PATH_APP.profile.user.root} passHref>
            <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
              <LoadingButton
                sx={{ color: 'surface.onSurface' }}
                startIcon={<Image width={20} height={20} src={Close} alt="upload" />}
              >
                <Typography variant="body2">Discard</Typography>
              </LoadingButton>
            </Box>
          </Link>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default MainProfileDeleteCoverAvatarDialog;
