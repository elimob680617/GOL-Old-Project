import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { InstituteTypeEnum } from 'src/@types/sections/serverTypes';
import { emptyUniversity, userUniversitySelector } from 'src/redux/slices/profile/userUniversity-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useAddPersonCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createPersonCollege.generated';
import { useUpdatePersonCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updatePersonCollege.generated';

export default function UniDiscardDialog() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  //Mutations
  const [createPersonUniversity, { isLoading: createIsLoading }] = useAddPersonCollegeMutation();
  const [updateCurrentUniversity, { isLoading: updateIsLoading }] = useUpdatePersonCollegeMutation();

  //For Redux Tools
  const dispatch = useDispatch();
  const userUniversity = useSelector(userUniversitySelector);
  const isEdit = !!userUniversity?.id;
  const handleSaveCollegeChangeOrContinue = async () => {
    if (!userUniversity?.isValid) {
      router.back();
    } else {
      const startDate = new Date(userUniversity?.startDate).toISOString();
      let endDate;
      if (userUniversity?.endDate) {
        endDate = new Date(userUniversity?.endDate).toISOString();
      }

      if (isEdit) {
        const response: any = await updateCurrentUniversity({
          filter: {
            dto: {
              id: userUniversity?.id,
              audience: userUniversity?.audience,
              collegeId: userUniversity?.collegeDto?.id,
              concentrationId: userUniversity?.concentrationDto?.id,
              graduated: userUniversity?.graduated,
              startDate: startDate,
              endDate: endDate,
              instituteType: InstituteTypeEnum.University,
            },
          },
        });
        if (response?.data?.updatePersonCollege?.isSuccess) {
          enqueueSnackbar('University updated successfully', { variant: 'success' });
          dispatch(emptyUniversity());
          router.push(PATH_APP.profile.user.publicDetails.root);
        }
      } else {
        const response: any = await createPersonUniversity({
          filter: {
            dto: {
              audience: userUniversity?.audience,
              graduated: userUniversity?.graduated,
              startDate: startDate,
              endDate: endDate,
              collegeId: userUniversity?.collegeDto?.id,
              concentrationId: userUniversity?.concentrationDto?.id,
              instituteType: InstituteTypeEnum.University,
            },
          },
        });
        if (response?.data?.addPersonCollege?.isSuccess) {
          enqueueSnackbar('University created successfully', { variant: 'success' });
          dispatch(emptyUniversity());
          router.push(PATH_APP.profile.user.publicDetails.root);
        }
      }
    }
  };

  const handleDiscard = () => {
    dispatch(emptyUniversity());
    router.push(PATH_APP.profile.user.publicDetails.root);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Do you want to {userUniversity?.isValid ? 'save changes' : 'continue'}?
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={createIsLoading || updateIsLoading}
            startIcon={<Save2 fontSize="24" variant="Outline" />}
            variant="text"
            color="inherit"
            onClick={handleSaveCollegeChangeOrContinue}
            sx={{ maxWidth: 130, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {userUniversity?.isValid ? 'Save Change' : 'Continue'}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />}
            onClick={handleDiscard}
            sx={{ maxWidth: 99 }}
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
