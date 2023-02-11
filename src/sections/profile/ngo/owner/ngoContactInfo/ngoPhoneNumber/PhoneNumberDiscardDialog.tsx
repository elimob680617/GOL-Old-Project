import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { phoneNumberAdded, userPhoneNumberSelector } from 'src/redux/slices/profile/userPhoneNumber-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useUpsertPhoneNumberMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertPhoneNumber.generated';

function PhoneNumberDiscardDialog() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const userPhoneNumber = useSelector(userPhoneNumberSelector);
  const [upsertUserPhoneNumber] = useUpsertPhoneNumberMutation();

  const handlerDiscardPhoneNumber = async () => {
    router.push(PATH_APP.profile.ngo.contactInfo.root);
    await sleep(1500);
    dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
  };

  const handleSaveChangePhoneNumber = async () => {
    const resData: any = await upsertUserPhoneNumber({
      filter: {
        dto: {
          id: userPhoneNumber?.id,
          phoneNumber: userPhoneNumber?.phoneNumber,
          audience: userPhoneNumber?.audience,
        },
      },
    });

    if (resData.data?.upsertUserPhoneNumber?.isSuccess) {
      router.push(PATH_APP.profile.ngo.contactInfo.root);
      await sleep(1500);
      dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserPhoneNumber?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserPhoneNumber?.messagingKey, { variant: 'error' });
    }
  };

  const handleBackRoute = () => {
    dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
    router.back();
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleBackRoute}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={handleBackRoute}>
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
          {userPhoneNumber?.id && (
            <>
              <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleSaveChangePhoneNumber}>
                <Icon name="Save" />
                <Typography variant="body2" color="text.primary">
                  Save Change
                </Typography>
              </Box>
              <Box
                sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}
                onClick={handlerDiscardPhoneNumber}
              >
                <Icon name="Close-1" color="error.main" />
                <Typography variant="body2" color="error">
                  Discard
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default PhoneNumberDiscardDialog;
