//mui
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';

interface MainProfileChangePhotoDialogProps {
  isProfilePhoto?: boolean;
}
function MainProfileNGOChangePhotoDialog(props: MainProfileChangePhotoDialogProps) {
  const { isProfilePhoto = false } = props;
  const router = useRouter();

  const handleRemove = async () => {
    if (isProfilePhoto) {
      router.push(PATH_APP.profile.ngo.ngoDeleteAvatar);
    } else {
      router.push(PATH_APP.profile.ngo.ngoDeleteCover);
    }
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
              Change {isProfilePhoto ? 'Profile' : 'Cover'} photo
            </Typography>
          </Box>
          {/* <IconButton onClick={() => router.back()}>
            <CloseSquare />
          </IconButton> */}
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Link href={isProfilePhoto ? PATH_APP.profile.ngo.ngoEditAvatar : PATH_APP.profile.ngo.ngoEditCover} passHref>
            <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
              <Icon name="upload-image" size={20} />
              <Typography variant="body2">Upload From System</Typography>
            </Box>
          </Link>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleRemove}>
            <Icon name="remove-image" size={20} color="error.main" />
            <Typography variant="body2" color="error">
              Remove Photo
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default MainProfileNGOChangePhotoDialog;
