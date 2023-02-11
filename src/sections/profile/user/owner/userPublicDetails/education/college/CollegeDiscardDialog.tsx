import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { InstituteTypeEnum } from 'src/@types/sections/serverTypes';
import { emptyCollege, userCollegesSelector } from 'src/redux/slices/profile/userColloges-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useAddPersonCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createPersonCollege.generated';
import { useUpdatePersonCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updatePersonCollege.generated';

export default function CollegeDiscardDialog() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  //For Redux Tools
  const dispatch = useDispatch();
  const userColleges = useSelector(userCollegesSelector);
  const isEdit = !!userColleges?.id;

  //Mutation
  const [createPersonCollege, { isLoading: addIsLoading }] = useAddPersonCollegeMutation();
  const [updateCurrentCollege, { isLoading: updateIsLoading }] = useUpdatePersonCollegeMutation();
  //Functions
  const handleSaveCollegeChangeOrContinue = async () => {
    if (!userColleges?.isValid) {
      router.back();
    } else {
      const startDate = new Date(userColleges?.startDate).toISOString();
      let endDate;
      if (userColleges?.endDate) {
        endDate = new Date(userColleges?.endDate).toISOString();
      }
      if (isEdit) {
        const response: any = await updateCurrentCollege({
          filter: {
            dto: {
              id: userColleges?.id,
              audience: userColleges?.audience,
              collegeId: userColleges?.collegeDto?.id,
              concentrationId: userColleges?.concentrationDto?.id,
              graduated: userColleges?.graduated,
              instituteType: InstituteTypeEnum.College,
              startDate: startDate,
              endDate: endDate,
            },
          },
        });
        if (response?.data?.updatePersonCollege?.isSuccess) {
          enqueueSnackbar('College edited successfully', { variant: 'success' });
          dispatch(emptyCollege());
          router.push(PATH_APP.profile.user.publicDetails.root);
        }
      } else {
        const response: any = await createPersonCollege({
          filter: {
            dto: {
              audience: userColleges?.audience,
              graduated: userColleges?.graduated,
              startDate: startDate,
              endDate: endDate,
              collegeId: userColleges?.collegeDto?.id,
              concentrationId: userColleges?.concentrationDto?.id,
              instituteType: InstituteTypeEnum.College,
            },
          },
        });
        if (response?.data?.addPersonCollege?.isSuccess) {
          enqueueSnackbar('College created successfully', { variant: 'success' });
          dispatch(emptyCollege());
          router.push(PATH_APP.profile.user.publicDetails.root);
        }
      }
    }
  };
  const handleDiscard = () => {
    dispatch(emptyCollege());
    router.push(PATH_APP.profile.user.publicDetails.root);
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
              Do you want to {userColleges?.isValid ? 'save changes' : 'continue'}?
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={addIsLoading || updateIsLoading}
            startIcon={<Save2 fontSize="24" variant="Outline" />}
            variant="text"
            color="inherit"
            onClick={handleSaveCollegeChangeOrContinue}
            sx={{ maxWidth: 130, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {userColleges?.isValid ? 'Save Change' : 'Continue'}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />}
            onClick={handleDiscard}
            sx={{ maxWidth: 99, justifyContent: 'flex-start' }}
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
