import { Box, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { RelationShipCleared, userRelationShipSelector } from 'src/redux/slices/profile/userRelationShip-slice';
import { useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUpdateRelationshipMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updateRelationship.generated';

function CloseDialogRelationship() {
  const router = useRouter();
  const theme = useTheme();
  const relationShip = useSelector(userRelationShipSelector);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!relationShip?.personId;

  const [updateRelationship] = useUpdateRelationshipMutation();

  const handelSaveChange = async () => {
    const resData: any = await updateRelationship({
      filter: {
        dto: {
          audience: relationShip?.audience,
          relationshipStatusId: relationShip?.relationshipStatus?.id,
        },
      },
    });
    if (resData?.data?.updateRelationship?.isSuccess) {
      dispatch(RelationShipCleared());
      enqueueSnackbar(
        isEdit ? 'The relationship has been successfully edited' : 'The relationship has been successfully added',
        { variant: 'success' }
      );

      router.push(PATH_APP.profile.user.publicDetails.root);
    }
  };
  const handelDiscard = () => {
    dispatch(RelationShipCleared());
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

export default CloseDialogRelationship;
