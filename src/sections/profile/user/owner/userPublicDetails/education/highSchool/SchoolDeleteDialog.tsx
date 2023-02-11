import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, CloseSquare, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { schoolWasEmpty, userSchoolsSelector } from 'src/redux/slices/profile/userSchool-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useDeletePersonSchoolMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/deletePersonSchool.generated';

export default function SchoolDeleteDialog() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  //Mutation
  const [deleteCurrentSchool, { isLoading }] = useDeletePersonSchoolMutation();
  //For Redux
  const dispatch = useDispatch();
  const userHighSchool = useSelector(userSchoolsSelector);

  // Functions
  const handleDeleteButton = async (currentSchoolId: string) => {
    const response: any = await deleteCurrentSchool({
      filter: {
        dto: {
          id: currentSchoolId,
        },
      },
    });
    if (response?.data?.deletePersonSchool?.isSuccess) {
      enqueueSnackbar('The school has been successfully deleted', { variant: 'success' });
      dispatch(schoolWasEmpty());
      router.push(PATH_APP.profile.user.publicDetails.root);
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };
  function handleDiscard() {
    dispatch(schoolWasEmpty());
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
              Are you sure to delete this High School?
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
            <LoadingButton
              variant="text"
              loading={isLoading}
              sx={{ p: 0 }}
              onClick={() => handleDeleteButton(userHighSchool?.id as string)}
            >
              <Typography variant="body2" color="error">
                Delete High School
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
