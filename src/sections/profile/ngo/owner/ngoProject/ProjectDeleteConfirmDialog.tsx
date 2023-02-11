import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Icon } from 'src/components/Icon';
import { emptyProject, ngoProjectSelector } from 'src/redux/slices/profile/ngoProject-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useDeleteProjectMutation } from 'src/_requests/graphql/profile/mainProfileNOG/mutations/deleteProject.generated';

function ProjectDeleteConfirmDialog() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const projectData = useSelector(ngoProjectSelector);
  const [deleteProject, { isLoading }] = useDeleteProjectMutation();

  const deleteHandler = async () => {
    const resDeleteData: any = await deleteProject({
      filter: {
        dto: {
          id: projectData?.id,
        },
      },
    });
    if (resDeleteData?.data?.deleteProject?.isSuccess) {
      enqueueSnackbar('The experience has been successfully deleted', { variant: 'success' });
      dispatch(emptyProject());
      router.push(PATH_APP.profile.ngo.project.list);
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };

  function discardHandler() {
    router.push(PATH_APP.profile.ngo.project.list);
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
              Are you sure to delete the current certificate?
            </Typography>
          </Box>
          <IconButton onClick={() => router.back()}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <Icon name="trash" color="error.main" />
            <LoadingButton variant="text" color="error" loading={isLoading} sx={{ p: 0 }}>
              <Typography variant="body2" color="error" onClick={deleteHandler}>
                Delete Current Project
              </Typography>
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={discardHandler}>
            <Icon name="Close-1" />
            <Typography variant="body2" color="text.primary">
              Discard
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ProjectDeleteConfirmDialog;
