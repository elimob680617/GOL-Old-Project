import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { emptyEmail, userEmailsSelector } from 'src/redux/slices/profile/contactInfo-slice-eli';
import { emptySocialMedia } from 'src/redux/slices/profile/socialMedia-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUpsertUserEmailMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertUserEmail.generated';

export default function EmailDiscardDialog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const personEmail = useSelector(userEmailsSelector);
  const [upsertUserEmail] = useUpsertUserEmailMutation();

  function handlerDiscardEmail() {
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    router.push(PATH_APP.profile.ngo.contactInfo.root);
  }

  const handleSaveChangeEmail = async () => {
    const resData: any = await upsertUserEmail({
      filter: {
        dto: {
          id: personEmail?.id,
          email: personEmail?.email,
          audience: personEmail?.audience,
        },
      },
    });

    if (resData.data?.upsertUserEmail?.isSuccess) {
      router.push(PATH_APP.profile.ngo.contactInfo.root);
      dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserEmail?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserEmail?.messagingKey, { variant: 'error' });
    }
  };

  const handleBackRoute = () => {
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    router.push('/profile/contact-info');
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleBackRoute}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Do you want to save changes?
            </Typography>
          </Box>

          <IconButton onClick={handleBackRoute}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleSaveChangeEmail}>
            <Icon name="Save" />
            <Typography variant="body2" color="text.primary">
              Save Change
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handlerDiscardEmail}>
            <Icon name="Close-1" color="error.main" />
            <Typography variant="body2" color="error">
              Discard
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}
