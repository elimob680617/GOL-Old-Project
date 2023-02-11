import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from 'src/components/Icon';
import { projectAdded } from 'src/redux/slices/profile/ngoProject-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';

function ProjectEditPhotoDialog() {
  const router = useRouter();
  const dispatch = useDispatch();

  function handleRemove() {
    dispatch(
      projectAdded({
        isChange: true,
      })
    );
    router.push(PATH_APP.profile.ngo.project.new);
  }
  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Edit Photo
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={1} sx={{ px: 2 }}>
          <Link href={PATH_APP.profile.ngo.project.photo} passHref>
            <LoadingButton
              variant="text"
              color="inherit"
              sx={{ maxWidth: 250 }}
              startIcon={<Icon name="upload-image" size={20} />}
            >
              <Typography variant="body2" color="text.primary">
                Upload New Photo From System
              </Typography>
            </LoadingButton>
          </Link>
          <Button
            variant="text"
            color="error"
            onClick={handleRemove}
            sx={{ maxWidth: 140 }}
            startIcon={<Icon name="remove-image" size={20} color="error.main" />}
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

export default ProjectEditPhotoDialog;
