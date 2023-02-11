import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Icon } from 'src/components/Icon';
import { emptyProject, ngoProjectSelector } from 'src/redux/slices/profile/ngoProject-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useAddProjectMutation } from 'src/_requests/graphql/profile/mainProfileNOG/mutations/addProject.generated';
import { useUpdateProjectMutation } from 'src/_requests/graphql/profile/mainProfileNOG/mutations/updateProject.generated';
import { useUpdateProjectMediaMutation } from 'src/_requests/graphql/profile/mainProfileNOG/mutations/updateProjectMedia.generated';

function ProjectDiscardDialog() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const projectData = useSelector(ngoProjectSelector);
  const [addProjectMutate, { isLoading: addLoading }] = useAddProjectMutation();
  const [updateProjectMutate, { isLoading: updateLoading }] = useUpdateProjectMutation();
  const [updateProjectMedia] = useUpdateProjectMediaMutation();

  function discardHandler() {
    dispatch(emptyProject());
    router.push(PATH_APP.profile.ngo.project.list);
  }

  const saveHandler = async () => {
    if (!projectData?.isValid) {
      router.back();
    } else {
      const startDate = new Date(projectData?.startDate);
      let endDate;
      if (projectData?.stillWorkingThere) endDate = undefined;
      else if (projectData?.endDate) {
        const date = new Date(projectData?.endDate);
        endDate = date.getFullYear() + '-' + date.getMonth() + 1 + '-01';
      }

      if (projectData?.id) {
        const res: any = await updateProjectMutate({
          filter: {
            dto: {
              id: projectData?.id,
              audience: projectData?.audience,
              description: projectData?.description,
              stillWorkingThere: projectData?.stillWorkingThere,
              title: projectData?.title,
              cityId: projectData?.cityDto?.id,
              startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
              endDate: endDate,
            },
          },
        });
        if (res?.data?.updateProject?.isSuccess) {
          const newId = res?.data?.addProject?.listDto?.items?.[0];
          if (!!projectData?.projectMedias?.length)
            await updateProjectMedia({
              filter: {
                dto: {
                  projectId: newId?.id,
                  urls: projectData?.projectMedias?.map((item) => item?.url) as string[],
                },
              },
            });
          enqueueSnackbar('update successfully', { variant: 'success' });
          dispatch(emptyProject());
          router.push(PATH_APP.profile.ngo.project.list);
        }
      } else {
        const res: any = await addProjectMutate({
          filter: {
            dto: {
              id: projectData?.id,
              audience: projectData?.audience,
              description: projectData?.description,
              stillWorkingThere: projectData?.stillWorkingThere,
              title: projectData?.title,
              cityId: projectData?.cityDto?.id,
              startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
              endDate: endDate,
            },
          },
        });

        if (res?.data?.addProject?.isSuccess) {
          const newId = res?.data?.addProject?.listDto?.items?.[0];
          if (!!projectData?.projectMedias?.length)
            await updateProjectMedia({
              filter: {
                dto: {
                  projectId: newId?.id,
                  urls: projectData?.projectMedias?.map((item) => item?.url) as string[],
                },
              },
            });
          enqueueSnackbar('Experience successfully', { variant: 'success' });
          dispatch(emptyProject());
          router.push(PATH_APP.profile.ngo.project.list);
        }
      }
    }
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
              Do you want to {projectData?.isValid ? 'save changes' : 'Continue'}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={addLoading || updateLoading}
            startIcon={<Icon name="Save" />}
            variant="text"
            color="inherit"
            onClick={saveHandler}
            sx={{ justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {projectData?.isValid ? 'Save Change' : 'Continue'}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="Close-1" color="error.main" />}
            onClick={discardHandler}
            sx={{ justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="error">
              Discard
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ProjectDiscardDialog;
