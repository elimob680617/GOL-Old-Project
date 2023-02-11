import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/mainProfileNOG/mutations/updateOrganizationUserField.generated';

interface MainProfileChangePhotoDialogProps {
  isProfilePhoto?: boolean;
}
function MainProfileNGODeleteDialog(props: MainProfileChangePhotoDialogProps) {
  const { initialize } = useAuth();
  const [updateOrganizationUserField, { isLoading }] = useUpdateOrganizationUserFieldMutation();
  const { isProfilePhoto = false } = props;
  const router = useRouter();

  const handleRemove = async () => {
    if (isProfilePhoto) {
      const res: any = await updateOrganizationUserField({
        filter: {
          dto: {
            field: OrgUserFieldEnum.AvatarUrl,
            avatarUrl: null,
          },
        },
      });
      if (res.data.updateOrganizationUserField.isSuccess) initialize();
    } else {
      await updateOrganizationUserField({
        filter: {
          dto: {
            field: OrgUserFieldEnum.CoverUrl,
            coverUrl: null,
          },
        },
      });
    }
    router.push(PATH_APP.profile.ngo.root);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {isProfilePhoto ? 'Do you want delete avatar Photo?' : 'Do you want delete Cover Photo?'}
            </Typography>
          </Box>
          <IconButton onClick={() => router.back()}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
            <LoadingButton
              onClick={handleRemove}
              loading={isLoading}
              startIcon={<Icon name="trash" color="error.main" />}
            >
              <Typography variant="body2" color="error">
                Delete Photo
              </Typography>
            </LoadingButton>
          </Box>
          <Link href={PATH_APP.profile.ngo.root} passHref>
            <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
              <LoadingButton sx={{ color: 'surface.onSurface' }} startIcon={<Icon name="Close-1" />}>
                <Typography variant="body2">Discard</Typography>
              </LoadingButton>
            </Box>
          </Link>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default MainProfileNGODeleteDialog;
