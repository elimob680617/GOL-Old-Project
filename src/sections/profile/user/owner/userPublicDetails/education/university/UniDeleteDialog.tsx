import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, CloseSquare, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { InstituteTypeEnum } from 'src/@types/sections/serverTypes';
import { emptyUniversity, userUniversitySelector } from 'src/redux/slices/profile/userUniversity-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useDeletePersonCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/deletePersonCollege.generated';

export default function UniDeleteDialog() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  //Mutation
  const [deleteCurrentUni, { isLoading }] = useDeletePersonCollegeMutation();
  //For Redux
  const dispatch = useDispatch();
  const userUneversity = useSelector(userUniversitySelector);
  const handleDeleteButton = async () => {
    const resp: any = await deleteCurrentUni({
      filter: {
        dto: {
          id: userUneversity?.id,
          instituteType: InstituteTypeEnum.University,
        },
      },
    });
    if (resp?.data?.deletePersonCollege?.isSuccess) {
      enqueueSnackbar('The university has been successfully deleted', { variant: 'success' });
      dispatch(emptyUniversity());
      router.push(PATH_APP.profile.user.publicDetails.root);
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };

  function handleDiscard() {
    dispatch(emptyUniversity());
    router.push(PATH_APP.profile.user.publicDetails.root);
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
              Are you sure to delete this University?
            </Typography>
          </Box>
          <IconButton onClick={handleDiscard}>
            <CloseSquare />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={1} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />
            <LoadingButton sx={{ p: 0 }} loading={isLoading} variant="text">
              <Typography variant="body2" color="error" onClick={() => handleDeleteButton()}>
                Delete University
              </Typography>
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
            <Save2 fontSize="24" variant="Outline" />
            <Typography variant="body2" color="text.primary" onClick={handleDiscard}>
              Discard
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}
