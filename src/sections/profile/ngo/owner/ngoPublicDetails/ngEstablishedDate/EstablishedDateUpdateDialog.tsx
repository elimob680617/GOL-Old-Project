import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EstablishmentdDatePayloadType } from 'src/@types/sections/profile/ngoPublicDetails';
import { AudienceEnum, OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import {
  ngoEstablishmentDateSelector,
  ngoEstablishmentDateUpdated,
  ngoEstablishmentDateWasEmpty,
} from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import sleep from 'src/utils/sleep';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';

export default function EstablishedDateUpdateDialog() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const ngoEstablishmentDate = useSelector(ngoEstablishmentDateSelector);
  const [upsertEstablishmentDateNgoUser, { isLoading: isLoading }] = useUpdateOrganizationUserFieldMutation();
  const isEdit = router.asPath === '/profile/ngo/public-details-edit-establishment/' ? true : false;

  const handleNavigation = (url: string) => {
    dispatch(
      ngoEstablishmentDateUpdated({
        ...getValues(),
        isChange: isDirty || ngoEstablishmentDate?.isChange,
      })
    );
    router.push(url);
  };
  const onSubmit = async (data: EstablishmentdDatePayloadType) => {
    const EstablishedDate = new Date(data.establishmentDate!);
    const result: any = await upsertEstablishmentDateNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.EstablishmentDate,
          establishmentDate: !!ngoEstablishmentDate?.establishmentDate
            ? EstablishedDate.getFullYear() + '-' + ('0' + (EstablishedDate.getMonth() + 1)).slice(-2) + '-01'
            : null,
          establishmentDateAudience: data.establishmentDateAudience,
        },
      },
    });
    if (result?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit
          ? 'The Establishment Date has been successfully  edited'
          : 'The Establishment Date has been successfully added',
        { variant: 'success' }
      );
      router.push(PATH_APP.profile.ngo.publicDetails.main);
      dispatch(ngoEstablishmentDateWasEmpty());
    }
  };

  const defaultValues = {
    ...ngoEstablishmentDate,
  };
  const methods = useForm<EstablishmentdDatePayloadType>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    watch,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = methods;

  const handelCloseDialog = async () => {
    if ((ngoEstablishmentDate?.isChange && ngoEstablishmentDate?.establishmentDate) || isDirty) {
      router.push(PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate.discardEstablsihedDate);
    } else {
      router.push(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(500);
      dispatch(ngoEstablishmentDateWasEmpty());
    }
  };

  const handleUpdateAudience = () => {
    dispatch(ngoEstablishmentDateUpdated(getValues()));
    router.push(PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate.audience);
  };

  useLayoutEffect(() => {
    const fetchData = async () => {
      await sleep(500);
    };
    if (!ngoEstablishmentDate) {
      router.push(PATH_APP.profile.ngo.publicDetails.main);
    }
    fetchData();
  }, [ngoEstablishmentDate, router]);

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
                  Edit Date of Establishment
                </Typography>
              ) : (
                <Typography variant="subtitle1" color="text.primary">
                  Add Date of Establishment
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
              Date of Establishment
            </Typography>
            {watch('establishmentDate') ? (
              <Typography
                variant="body2"
                color={ngoEstablishmentDate?.establishmentDate ? 'text.primary' : 'text.secondary'}
                sx={{ cursor: 'pointer' }}
              >
                {getMonthName(new Date(watch('establishmentDate')!))},{' '}
                {new Date(watch('establishmentDate')!).getFullYear()}
                <IconButton
                  onClick={() => {
                    setValue('establishmentDate', undefined, { shouldDirty: true });
                    dispatch(ngoEstablishmentDateUpdated({ ...getValues(), isChange: true }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box onClick={() => handleNavigation(PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate.selectDate)}>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  Date of Establishment
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />

          <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isEdit && (
                <Link href={PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate.deleteEstablishedDate} passHref>
                  <Button color="error">
                    <Typography variant="button">Delete</Typography>
                  </Button>
                </Link>
              )}
              <Button
                variant="outlined"
                onClick={handleUpdateAudience}
                startIcon={<Icon name="Earth" />}
                endIcon={<Icon name="down-arrow" color="error.main" />}
              >
                <Typography color="text.primary">
                  {
                    Object.keys(AudienceEnum)[
                      Object.values(AudienceEnum).indexOf(
                        ngoEstablishmentDate?.establishmentDateAudience as AudienceEnum
                      )
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
                disabled={!(isDirty || ngoEstablishmentDate?.isChange) || !ngoEstablishmentDate?.establishmentDate}
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
