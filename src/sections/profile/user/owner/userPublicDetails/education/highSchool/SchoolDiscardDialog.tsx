import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { schoolWasEmpty, userSchoolsSelector } from 'src/redux/slices/profile/userSchool-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useAddPersonSchoolMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createPersonSchool.generated';
import { useUpdatePersonSchoolMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updatePersonSchool.generated';

export default function SchoolDiscardDialog() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  //Mutation
  const [createPersonSchool, { isLoading: createIsLoading, data: userSchool }] = useAddPersonSchoolMutation();
  const [updateCurrentSchool, { isLoading: updateIsLoading, data: editUserSchool }] = useUpdatePersonSchoolMutation();

  //For Redux Tools
  const dispatch = useDispatch();
  const userHighSchool = useSelector(userSchoolsSelector);
  const isEdit = !!userHighSchool?.id;

  // Functions
  const handleSaveSchoolChangeOrContinue = async () => {
    if (!userHighSchool?.isValid) {
      router.back();
    } else {
      if (isEdit) {
        //update mutation func
        const response: any = await updateCurrentSchool({
          filter: {
            dto: {
              id: userHighSchool.id,
              year: userHighSchool?.year ? +userHighSchool.year : undefined,
              schoolId: userHighSchool.school?.id,
              audience: userHighSchool?.audience,
            },
          },
        });
        if (response?.data?.updatePersonSchool?.isSuccess) {
          enqueueSnackbar('The High school has been successfully edited ', { variant: 'success' });
          dispatch(schoolWasEmpty());
          router.push(PATH_APP.profile.user.publicDetails.root);
        } else {
          enqueueSnackbar('The High school unfortunately not edited', { variant: 'error' });
        }
      } else {
        //add mutation func
        const response: any = await createPersonSchool({
          filter: {
            dto: {
              // id: null,
              year: userHighSchool?.year ? +userHighSchool.year : undefined,
              schoolId: userHighSchool.school?.id,
              audience: userHighSchool?.audience,
            },
          },
        });
        if (response?.data?.addPersonSchool?.isSuccess) {
          enqueueSnackbar('The High school has been successfully added ', { variant: 'success' });
          dispatch(schoolWasEmpty());
          router.push(PATH_APP.profile.user.publicDetails.root);
        } else {
          enqueueSnackbar('The High school unfortunately not added', { variant: 'error' });
        }
      }
    }
  };

  const handleDiscard = () => {
    dispatch(schoolWasEmpty());
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
              Do you want to {userHighSchool?.isValid ? 'save changes' : 'continue'}?
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
            onClick={handleSaveSchoolChangeOrContinue}
            sx={{ maxWidth: 130, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {userHighSchool?.isValid ? 'Save Change' : 'Continue'}
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
