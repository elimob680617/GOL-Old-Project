import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, CloseSquare, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { emptyExperience, userExperienceSelector } from 'src/redux/slices/profile/userExperiences-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useDeleteExperienceMutation } from 'src/_requests/graphql/profile/experiences/mutations/updateExperience.generated';

function ExperienceDeleteConfirmDialog() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const userExperience = useSelector(userExperienceSelector);
  const [deleteExperience, { isLoading }] = useDeleteExperienceMutation();

  // functions !
  const deleteHandler = async () => {
    const resDeleteData: any = await deleteExperience({
      filter: {
        dto: {
          id: userExperience?.id,
        },
      },
    });
    if (resDeleteData?.data?.deleteExperience?.isSuccess) {
      enqueueSnackbar('The experience has been successfully deleted', { variant: 'success' });
      dispatch(emptyExperience());
      router.push(PATH_APP.profile.user.experience.root);
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };

  function discardHandler() {
    router.push(PATH_APP.profile.user.experience.root);
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
              Are you sure to delete the current Experience?
            </Typography>
          </Box>
          <IconButton onClick={() => router.back()}>
            <CloseSquare />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />
            <LoadingButton variant="text" color="error" loading={isLoading} sx={{ p: 0 }}>
              <Typography variant="body2" color="error" onClick={deleteHandler}>
                Delete Current Experience
              </Typography>
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={discardHandler}>
            <Save2 fontSize="24" variant="Outline" />
            <Typography variant="body2" color="text.primary">
              Discard
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ExperienceDeleteConfirmDialog;
