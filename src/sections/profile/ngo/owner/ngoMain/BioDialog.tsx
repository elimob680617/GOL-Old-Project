import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { OrganizationUserBioInput } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { bioCleared, bioSelector } from 'src/redux/slices/profile/ngoProfileBio-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUpdateOrganizationUserBioMutation } from 'src/_requests/graphql/profile/mainProfileNOG/mutations/updateOrganizationUserBio.generated';

//.........................................................
const RootStyle = styled(Box)(({ theme }) => ({
  with: 600,
  height: 656,
}));
const RHFTextFieldStyle = styled(RHFTextField)(({ theme }) => ({
  width: '100%',
  height: 470,
  border: 'none',
  overflowX: 'auto',
  scrollbarColor: `${theme.palette.grey[300]} ${theme.palette.grey[0]}`,
  scrollbarWidth: 'auto',
  '&::-webkit-scrollbar': {
    width: 12,
  },

  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[0],
    borderRadius: 8,
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 10,
    border: `4px solid ${theme.palette.grey[0]}`,
  },
}));

function BioDialog() {
  const router = useRouter();
  const { initialize } = useAuth();
  const ngoBio = useSelector(bioSelector);
  const dispatch = useDispatch();

  const [userBio, { isLoading }] = useUpdateOrganizationUserBioMutation();
  const onSubmit = async (data: OrganizationUserBioInput) => {
    const result: any = await userBio({
      filter: {
        dto: {
          body: data?.body,
        },
      },
    });
    if (result.data?.updateOrganizationUserBio?.isSuccess) {
      dispatch(bioCleared());
    }
    // router.push(PATH_APP.profile.ngo.root);
    handleClose();
  };

  const defaultValues = {
    body: ngoBio,
  };
  const methods = useForm<OrganizationUserBioInput>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    watch,
    handleSubmit,
    formState: { isDirty },
  } = methods;

  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizard') === 'true';
    const fromHomePage = localStorage.getItem('fromHomePage') === 'true';
    if (fromWizard) {
      initialize();
      localStorage.removeItem('fromWizard');
      if (fromHomePage) {
        router.push(PATH_APP.home.wizard.wizardList);
      } else {
        router.push(PATH_APP.profile.ngo.wizard.wizardList);
      }
    } else {
      router.push(PATH_APP.profile.ngo.root);
    }
  }

  function handleBioSubmit() {}
  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleClose}>
      <RootStyle>
        <Stack p={2} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">Bio</Typography>
          <IconButton onClick={handleClose}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2, width: '100%', height: 490 }}>
            <RHFTextFieldStyle
              size="small"
              multiline
              name="body"
              variant="outlined"
              placeholder="What do you want to talk about?"
              inputProps={{ maxLength: 1000 }}
              // onBlur={() => setValue('descView', true)}
              autoFocus
              sx={{
                '& fieldset': {
                  border: 'unset',
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'end', p: 2 }}>
            <LoadingButton
              size="large"
              variant="contained"
              sx={{ px: 5 }}
              type="submit"
              disabled={!isDirty || !(watch('body') || ngoBio)}
              loading={isLoading}
              onClick={handleBioSubmit}
            >
              <Typography variant="button" sx={{ color: 'common.white' }}>
                Save
              </Typography>
            </LoadingButton>
          </Box>
        </FormProvider>
      </RootStyle>
    </Dialog>
  );
}

export default BioDialog;
