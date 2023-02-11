import { Box, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, CloseSquare, Save2, TrushSquare } from 'iconsax-react';
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { emptyLocation, userLocationSelector } from 'src/redux/slices/profile/userLocation-slice';

import { useDeleteLocationMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/deleteLocation.generated';
import { useDispatch, useSelector } from 'src/redux/store';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { PATH_APP } from 'src/routes/paths';

function ConfirmDeleteCurrentCity() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const userCity = useSelector(userLocationSelector);
  const { enqueueSnackbar } = useSnackbar();

  const [deleteUserLocations, { isLoading }] = useDeleteLocationMutation();

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await deleteUserLocations({
      filter: {
        dto: {
          id: userCity?.id,
        },
      },
    });
    if (resDataDelete?.data?.deleteLocation?.isSuccess) {
      enqueueSnackbar('The current city has been successfully deleted', { variant: 'success' });
      dispatch(emptyLocation());
    }
    //  else {
    //   enqueueSnackbar('current city deleted failed ', { variant: 'error' });
    // }
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
              Are you sure to delete the current city?
            </Typography>
          </Box>
          <Link href={PATH_APP.profile.user.publicDetails.root} passHref>
            <IconButton>
              <CloseSquare />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={1} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />
            <LoadingButton variant="text" loading={isLoading} sx={{ p: 0 }}>
              <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
                Delete Current City
              </Typography>
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
            <Save2 fontSize="24" variant="Outline" />

            <Link href={PATH_APP.profile.user.publicDetails.root} passHref>
              <Typography variant="body2" color="text.primary">
                Discard
              </Typography>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ConfirmDeleteCurrentCity;
