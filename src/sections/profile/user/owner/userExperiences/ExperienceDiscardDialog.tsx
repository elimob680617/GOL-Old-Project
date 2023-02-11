import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { emptyExperience, userExperienceSelector } from 'src/redux/slices/profile/userExperiences-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useAddExperienceMutation } from 'src/_requests/graphql/profile/experiences/mutations/addExperience.generated';
import { useUpdateExperienceMutation } from 'src/_requests/graphql/profile/experiences/mutations/updateExperience.generated';
function DiscardCertificate() {
  const { enqueueSnackbar } = useSnackbar();
  const userExperience = useSelector(userExperienceSelector);
  const [addExperienceMutate, { isLoading: addLoading }] = useAddExperienceMutation();
  const [updateExperienceMutate, { isLoading: updateLoading }] = useUpdateExperienceMutation();

  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();

  // function !
  // click on Diskard
  function discardHandler() {
    dispatch(emptyExperience());
    router.push(PATH_APP.profile.user.experience.root);
  }

  // click on Save to mutaiation data and from Redux
  const saveHandler = async () => {
    if (!userExperience?.isValid) {
      router.back();
    } else {
      const startDate = new Date(userExperience?.startDate);
      let endDate;
      if (userExperience?.stillWorkingThere) endDate = undefined;
      else if (userExperience?.endDate) {
        const date = new Date(userExperience?.endDate);
        endDate = date.getFullYear() + '-' + date.getMonth() + 1 + '-01';
      }

      if (userExperience?.id) {
        const res: any = await updateExperienceMutate({
          filter: {
            dto: {
              id: userExperience?.id,
              audience: userExperience?.audience,
              employmentType: userExperience?.employmentType,
              description: userExperience?.description,
              mediaUrl: userExperience?.mediaUrl,
              stillWorkingThere: userExperience?.stillWorkingThere,
              title: userExperience?.title,
              cityId: userExperience?.cityDto?.id,
              companyId: userExperience?.companyDto?.id,
              startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
              endDate: endDate,
            },
          },
        });
        if (res?.data?.updateExperience?.isSuccess) {
          enqueueSnackbar('update successfully', { variant: 'success' });
          dispatch(emptyExperience());
          router.push(PATH_APP.profile.user.experience.root);
        }
      } else {
        const res: any = await addExperienceMutate({
          filter: {
            dto: {
              audience: userExperience?.audience,
              employmentType: userExperience?.employmentType,
              description: userExperience?.description,
              mediaUrl: userExperience?.mediaUrl,
              stillWorkingThere: userExperience?.stillWorkingThere,
              title: userExperience?.title,
              cityId: userExperience?.cityDto?.id,
              companyId: userExperience?.companyDto?.id,
              startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
              endDate: endDate,
            },
          },
        });

        if (res?.data?.addExperience?.isSuccess) {
          enqueueSnackbar('Experience successfully', { variant: 'success' });
          dispatch(emptyExperience());
          router.push(PATH_APP.profile.user.experience.root);
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
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Do you want to {userExperience?.isValid ? 'save changes' : 'Continue'}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={addLoading || updateLoading}
            startIcon={<Save2 fontSize="24" variant="Outline" />}
            variant="text"
            color="inherit"
            onClick={saveHandler}
            sx={{ maxWidth: 130, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {userExperience?.isValid ? 'Save Change' : 'Continue'}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />}
            onClick={discardHandler}
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

export default DiscardCertificate;
