import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GroupCategoryType } from 'src/@types/sections/profile/ngoPublicDetails';
import { AudienceEnum, OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import {
  ngoCategorySelector,
  ngoCategoryUpdated,
  ngoCategoryWasEmpty,
} from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';

export default function CategoryUpdateDialog() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const ngoCategory = useSelector(ngoCategorySelector);
  const [upsertCategoryNgoUser, { isLoading: isLoading }] = useUpdateOrganizationUserFieldMutation();

  const isEdit = router.asPath === '/profile/ngo/public-details-edit-category/';

  const onSubmit = async (data: GroupCategoryType) => {
    const result: any = await upsertCategoryNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.GroupCategory,
          groupCategoryAudience: data.categoryAudience,
          groupCategoryId: data.id,
        },
      },
    });
    if (result?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit ? 'The Category has been successfully  edited' : 'The Category has been successfully added',
        { variant: 'success' }
      );
      router.push(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(1500);
      dispatch(ngoCategoryWasEmpty());
    }
  };
  const defaultValues = {
    ...ngoCategory,
  };
  const methods = useForm<GroupCategoryType>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = methods;

  const handelCloseDialog = async () => {
    if ((ngoCategory?.title && !getValues().id) || (ngoCategory?.title && ngoCategory.isChange)) {
      router.push(PATH_APP.profile.ngo.publicDetails.ngoCategory.discardCategory);
    } else {
      router.push(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(2000);
      dispatch(ngoCategoryWasEmpty());
    }
  };
  const handleCategoryAudience = () => {
    dispatch(ngoCategoryUpdated(getValues()));
    router.push(PATH_APP.profile.ngo.publicDetails.ngoCategory.audience);
  };
  useLayoutEffect(() => {
    const fetchData = async () => {
      await sleep(500);
    };
    if (!ngoCategory) {
      router.push(PATH_APP.profile.ngo.publicDetails.main);
    }
    fetchData();
  }, [ngoCategory, router]);

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handelCloseDialog}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ minWidth: 600, minHeight: 234, py: 3 }}>
          <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
                <Icon name="left-arrow-1" />
              </IconButton>
              {isEdit ? (
                <Typography variant="subtitle1" color="text.primary">
                  Edit NGO Category
                </Typography>
              ) : (
                <Typography variant="subtitle1" color="text.primary">
                  Add NGO Category
                </Typography>
              )}
            </Box>
            <IconButton onClick={handelCloseDialog}>
              <Icon name="Close-1" />
            </IconButton>
          </Stack>

          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              NGO Category
            </Typography>
            <Link href={PATH_APP.profile.ngo.publicDetails.ngoCategory.searchCategory} passHref>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 1 }}>
                {watch('title') && (
                  <img src={ngoCategory?.iconUrl} width={24} height={24} alt="" style={{ marginRight: 8 }} />
                )}
                <Typography
                  variant="body2"
                  color={ngoCategory?.title ? 'text.primary' : 'text.secondary'}
                  sx={{ cursor: 'pointer' }}
                >
                  {watch('title') || 'NGO Category'}
                </Typography>
              </Box>
            </Link>
          </Stack>

          <Divider />
          <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isEdit && (
                <Link href={PATH_APP.profile.ngo.publicDetails.ngoCategory.deleteCategory} passHref>
                  <Button color="error">
                    <Typography variant="button">Delete</Typography>
                  </Button>
                </Link>
              )}
              <Button
                variant="outlined"
                onClick={handleCategoryAudience}
                startIcon={<Icon name="Earth" />}
                endIcon={<Icon name="down-arrow" color="error.main" />}
              >
                <Typography color="text.primary">
                  {
                    Object.keys(AudienceEnum)[
                      Object.values(AudienceEnum).indexOf(ngoCategory?.categoryAudience as AudienceEnum)
                    ]
                  }
                </Typography>
              </Button>
            </Box>
            <Box>
              <LoadingButton
                loading={isLoading}
                type="submit"
                color="primary"
                variant="contained"
                disabled={!ngoCategory?.title || !(isDirty || ngoCategory.isChange)}
              >
                {isEdit ? 'Save' : 'Add'}
              </LoadingButton>
            </Box>
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}
