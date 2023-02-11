import { Box, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { emptyLocation, userLocationSelector } from 'src/redux/slices/profile/userLocation-slice';
import { useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUpsertLocationMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/addCurrentCity.generated';

function CloseDialogCurrentCity() {
  const router = useRouter();
  const theme = useTheme();
  const userCity = useSelector(userLocationSelector);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!userCity?.id;

  const [upsertLocation] = useUpsertLocationMutation();
  const handelSaveChange = async () => {
    const result: any = await upsertLocation({
      filter: {
        dto: {
          audience: userCity?.audience,
          cityId: userCity?.city?.id,
          id: userCity?.id,
          locationType: userCity?.locationType,
        },
      },
    });

    if (result?.data?.upsertLocation?.isSuccess) {
      enqueueSnackbar(
        isEdit ? 'The current city has been successfully  edited' : 'The current city has been successfully added',
        { variant: 'success' }
      );
      router.push(PATH_APP.profile.user.publicDetails.root);
      dispatch(emptyLocation());
    }
  };
  const handelDiscard = () => {
    dispatch(emptyLocation());
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
              Do you want to save changes?
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 130 }} onClick={handelSaveChange}>
            <Save2 fontSize="24" variant="Outline" />
            <Typography variant="body2" color="text.primary">
              Save Change
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handelDiscard}>
            <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />
            <Typography variant="body2" color="error">
              Discard
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default CloseDialogCurrentCity;
