import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { ngoSizeWasEmpty } from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';

export default function SizeDeleteDialog() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const [upsertSizeNgoUser, { isLoading }] = useUpdateOrganizationUserFieldMutation();

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await upsertSizeNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Size,
          numberRangeId: null,
        },
      },
    });
    if (resDataDelete?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar('The Size has been successfully deleted', { variant: 'success' });
      await sleep(1500);
      dispatch(ngoSizeWasEmpty());
    }
    router.push(PATH_APP.profile.ngo.publicDetails.main);
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
              Do you want to delete NGO Size?
            </Typography>
          </Box>
          <Link href={PATH_APP.profile.ngo.publicDetails.main} passHref>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={1} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <Icon name="trash" color="error.main" />
            <LoadingButton variant="text" loading={isLoading} sx={{ p: 0 }}>
              <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
                Delete NGO Size
              </Typography>
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
            <Icon name="Close-1" />
            <Link href={PATH_APP.profile.ngo.publicDetails.main} passHref>
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
