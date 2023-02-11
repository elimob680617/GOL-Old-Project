import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { ngoCategorySelector, ngoCategoryWasEmpty } from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';

function CategoryDiscardDialog() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [upsertCategoryNgoUser] = useUpdateOrganizationUserFieldMutation();

  const ngoCategory = useSelector(ngoCategorySelector);
  const dispatch = useDispatch();
  const isEdit = !!ngoCategory?.id;

  const handelSaveChange = async () => {
    const result: any = await upsertCategoryNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.GroupCategory,
          groupCategoryAudience: ngoCategory?.categoryAudience,
          groupCategoryId: ngoCategory?.id,
        },
      },
    });
    if (result?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit ? 'The Category has been successfully  edited' : 'The Category has been successfully added',
        { variant: 'success' }
      );
      router.push(PATH_APP.profile.ngo.publicDetails.main);
      dispatch(ngoCategoryWasEmpty());
    }
  };
  const handelDiscard = () => {
    router.push(PATH_APP.profile.ngo.publicDetails.main);
    dispatch(ngoCategoryWasEmpty());
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
              Do you want to save changes?
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 130 }} onClick={handelSaveChange}>
            <Icon name="Save" />
            <Typography variant="body2" color="text.primary">
              Save Change
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handelDiscard}>
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

export default CategoryDiscardDialog;
