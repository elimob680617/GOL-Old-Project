import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NumberRangePayloadType } from 'src/@types/sections/profile/ngoPublicDetails';
import { AudienceEnum, OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import { ngoSizeSelector, ngoSizeUpdated, ngoSizeWasEmpty } from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';

export default function SizeUpdateDialog() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const ngoSize = useSelector(ngoSizeSelector);
  const isEdit = router.asPath === '/profile/ngo/public-details-edit-size/';
  const dispatch = useDispatch();
  const [upsertSizeNgoUser, { isLoading: isLoading }] = useUpdateOrganizationUserFieldMutation();

  const onSubmit = async (data: NumberRangePayloadType) => {
    const resData: any = await upsertSizeNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Size,
          sizeAudience: data.sizeAudience,
          numberRangeId: data.id,
        },
      },
    });
    if (resData?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit ? 'The NGO Size has been successfully edited' : 'The NGO Size has been successfully added',
        { variant: 'success' }
      );
      router.push(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(1500);
      dispatch(ngoSizeWasEmpty());
    }
  };

  const defaultValues = {
    ...ngoSize,
  };
  const methods = useForm<NumberRangePayloadType>({
    defaultValues,
    mode: 'onChange',
  });

  const { getValues, handleSubmit, watch } = methods;

  const handelCloseDialog = async () => {
    if ((ngoSize?.desc && !getValues().id) || (ngoSize?.desc && ngoSize?.isChange)) {
      router.push(PATH_APP.profile.ngo.publicDetails.ngoSize.discardSize);
    } else {
      router.push(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(2000);
      dispatch(ngoSizeWasEmpty());
    }
  };
  const handleCategoryAudience = () => {
    dispatch(ngoSizeUpdated(getValues()));
    router.push(PATH_APP.profile.ngo.publicDetails.ngoSize.audience);
  };

  useLayoutEffect(() => {
    if (!ngoSize) router.push(PATH_APP.profile.ngo.publicDetails.main);
  }, [ngoSize, router]);

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => handelCloseDialog()}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ minWidth: 600, minHeight: 234, py: 3 }}>
          <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
                <Icon name="left-arrow-1" />
              </IconButton>
              <Typography variant="subtitle1" color="text.primary">
                {isEdit ? 'Edit NGO Size' : ' Add NGO Size'}
              </Typography>
            </Box>
            <IconButton onClick={handelCloseDialog}>
              <Icon name="Close-1" />
            </IconButton>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              NGO Size
            </Typography>
            <Link href={PATH_APP.profile.ngo.publicDetails.ngoSize.selectSize} passHref>
              <Button
                color="primary"
                size="large"
                variant="contained"
                sx={{ borderColor: 'text.disabled' }}
                startIcon={<Icon name="down-arrow" color="common.white" />}
              >
                <Typography color="common.white" variant="button">
                  {watch('desc') ? watch('desc') : 'NGO Size'}
                </Typography>
              </Button>
            </Link>
          </Stack>
          <Divider />

          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ px: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box>
                {isEdit && (
                  <Link href={PATH_APP.profile.ngo.publicDetails.ngoSize.deleteSize} passHref>
                    <Button color="error">
                      <Typography variant="button">Delete</Typography>
                    </Button>
                  </Link>
                )}
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<Icon name="Earth" />}
                  onClick={handleCategoryAudience}
                  endIcon={<Icon name="down-arrow" color="error.main" />}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(ngoSize?.sizeAudience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
              </Box>
            </Box>

            <Box>
              <LoadingButton
                loading={isLoading}
                type="submit"
                color="primary"
                variant="contained"
                disabled={!ngoSize?.desc || !ngoSize?.isChange}
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
