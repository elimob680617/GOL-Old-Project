import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { ngoPlaceSelector, ngoPlaceWasEmpty } from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';

export default function LocationDiscardDialog() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const ngoPlace = useSelector(ngoPlaceSelector);
  const [upsertPlaceNgoUser, { isLoading }] = useUpdateOrganizationUserFieldMutation();

  const handleSaveSchoolChangeOrContinue = async () => {
    const response: any = await upsertPlaceNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Place,
          placeAudience: ngoPlace?.placeAudience,
          googlePlaceId: ngoPlace?.placeId,
          address: ngoPlace?.address,
          lat: ngoPlace?.lat,
          lng: ngoPlace?.lng,
        },
      },
    });
    if (response?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar('The Location has been successfully updated ', { variant: 'success' });
      router.push(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(2000);
      dispatch(ngoPlaceWasEmpty());
    } else {
      enqueueSnackbar('The High school unfortunately not updated', { variant: 'error' });
    }
  };

  const handleDiscard = async () => {
    router.push(PATH_APP.profile.ngo.publicDetails.main);
    await sleep(2000);
    dispatch(ngoPlaceWasEmpty());
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Do you want to {ngoPlace?.description ? 'save changes' : 'continue'}?
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={isLoading}
            startIcon={<Icon name="Save" />}
            variant="text"
            color="inherit"
            onClick={handleSaveSchoolChangeOrContinue}
            sx={{ justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {ngoPlace?.description ? 'Save Change' : 'Continue'}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="Close-1" color="error.main" />}
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
