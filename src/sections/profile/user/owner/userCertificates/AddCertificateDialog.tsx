import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, Stack, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { ArrowDown2, ArrowLeft, CloseSquare, Eye } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// toast
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
// Rhf and yup
import { useForm } from 'react-hook-form';
import { AudienceEnum, Certificate } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import {
  certificateCleared,
  certificateUpdated,
  userCertificateSelector,
} from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import { useUpsertCertificateMutation } from 'src/_requests/graphql/profile/certificates/mutations/upsertCertificate.generated';
// Mutations !
import * as Yup from 'yup';

function AddCertificateDialog() {
  const URL =
    /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const theme = useTheme();
  const userCertificate = useSelector(userCertificateSelector);
  const dispatch = useDispatch();

  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) router.push(PATH_APP.profile.user.certificate.root);
  }, [userCertificate, router]);

  // mutation !
  const [upsertCertificate, { isLoading }] = useUpsertCertificateMutation();
  // yup
  const certificateValidation = Yup.object()
    .shape({
      certificateName: Yup.object()
        .shape({
          title: Yup.string().required(),
        })
        .required(),
      issuingOrganization: Yup.object()
        .shape({
          title: Yup.string().required(),
        })
        .required(),

      credentialUrl: Yup.string()
        .matches(URL, { message: 'Enter a valid url', excludeEmptyString: true })
        .notRequired()
        .nullable(),
      issueDate: Yup.string().required(''),
    })
    .required();

  const methods = useForm<Certificate>({
    defaultValues: {
      ...userCertificate,
      credentialID: userCertificate?.credentialID ? userCertificate?.credentialID : '',
      credentialUrl: userCertificate?.credentialUrl ? userCertificate?.credentialUrl : '',
    },
    resolver: yupResolver(certificateValidation),
    mode: 'onChange',
  });

  const {
    trigger,
    setValue,
    watch,
    getValues,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = methods;

  const onSubmit = async (data: Certificate) => {
    const resData: any = await upsertCertificate({
      filter: {
        dto: {
          id: userCertificate?.id,
          certificateNameId: data.certificateName?.id,
          issuingOrganizationId: data.issuingOrganization?.id,
          credentialDoesExpire: !data.credentialDoesExpire,
          issueDate: new Date(data.issueDate).toISOString(),
          expirationDate: !data?.credentialDoesExpire ? data?.expirationDate : undefined,
          credentialID: data?.credentialID?.length === 0 ? undefined : data.credentialID,
          credentialUrl: data?.credentialUrl?.length === 0 ? undefined : data.credentialUrl,
          audience: data.audience,
        },
      },
    });
    if (resData?.data?.upsertCertificate.isSuccess) {
      if (userCertificate?.id) enqueueSnackbar('The certificate has been successfully edited ', { variant: 'success' });
      else enqueueSnackbar('The certificate has been successfully added ', { variant: 'success' });
      dispatch(certificateCleared());
      router.push(PATH_APP.profile.user.certificate.root);
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };

  // navigate and send data to Redux
  const handleNavigation = (url: string) => {
    dispatch(certificateUpdated({ ...getValues(), isChange: isDirty || userCertificate?.isChange }));
    router.push(url);
  };

  // useEffecgt for Trigger
  useEffect(() => {
    trigger(['certificateName', 'issuingOrganization']);
  }, []);

  // click on closeicon and go to Discard or profile
  function handleCloseCertificateDialog() {
    if (isDirty || userCertificate?.isChange) {
      dispatch(
        certificateUpdated({
          ...getValues(),
          isChange: isDirty || userCertificate?.isChange,
          isValid: isValid || userCertificate?.isValid,
        })
      );
      router.push(PATH_APP.profile.user.certificate.discard);
    } else {
      router.push(PATH_APP.profile.user.certificate.root);
      dispatch(certificateCleared());
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={handleCloseCertificateDialog}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={2} direction="row" alignItems="center">
            <IconButton sx={{ p: 0 }} onClick={handleCloseCertificateDialog}>
              <ArrowLeft color={theme.palette.text.primary} />
            </IconButton>
            <Typography variant="subtitle1">{userCertificate?.id ? 'Edit Certificate' : 'Add Certificate'}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={handleCloseCertificateDialog}>
              <CloseSquare variant="Outline" color={theme.palette.text.secondary} />
            </IconButton>
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Certificate Name*
            </Typography>
            <Box mt={2} />
            <Box onClick={() => handleNavigation(PATH_APP.profile.user.certificate.searchName)}>
              {watch('certificateName') ? (
                <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                  {watch('certificateName')?.title}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  Ex: Microsoft certified network security
                </Typography>
              )}
            </Box>
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Issuing Organization*
            </Typography>
            <Box mt={2} />
            <Box onClick={() => handleNavigation(PATH_APP.profile.user.certificate.issueOrganizationName)}>
              {watch('issuingOrganization') ? (
                <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                  {watch('issuingOrganization')?.title}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  Ex: Garden of Love
                </Typography>
              )}
            </Box>
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Stack direction="row" alignItems="center">
              <RHFCheckbox
                label={
                  <Typography color={theme.palette.text.primary} variant="body2">
                    This credential does not expire
                  </Typography>
                }
                name="credentialDoesExpire"
                sx={{
                  color: 'primary.main',
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                  pl: 0,
                  m: 0,
                }}
              />
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Issue Date*
            </Typography>
            <Box mt={2} />
            {watch('issueDate') ? (
              <Typography variant="body2" color="text.primary" sx={{ cursor: 'default' }}>
                {getMonthName(new Date(watch('issueDate')))} , {new Date(watch('issueDate')).getFullYear()}
                <IconButton
                  onClick={() => {
                    setValue('issueDate', undefined, { shouldValidate: true, shouldDirty: true });
                    // setValue('expirationDate', undefined, { shouldDirty: true });
                    dispatch(certificateUpdated({ ...getValues() }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box onClick={() => handleNavigation(PATH_APP.profile.user.certificate.issueDate)}>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  Issue Date
                </Typography>
              </Box>
            )}
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Expiration Date
            </Typography>

            <Box mt={2} />
            {watch('expirationDate') && !watch('credentialDoesExpire') ? (
              <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                {getMonthName(new Date(watch('expirationDate')))} , {new Date(watch('expirationDate')).getFullYear()}
                <IconButton
                  onClick={() => {
                    setValue('expirationDate', undefined, { shouldValidate: true, shouldDirty: true });
                    dispatch(certificateUpdated({ ...getValues(), isChange: true }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box
                onClick={() =>
                  watch('credentialDoesExpire')
                    ? undefined
                    : handleNavigation(PATH_APP.profile.user.certificate.expirationDate)
                }
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ cursor: watch('credentialDoesExpire') ? 'default' : 'pointer' }}
                >
                  {watch('credentialDoesExpire') ? 'No Expiration' : 'Expiration Date'}
                </Typography>
              </Box>
            )}
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Credential ID
            </Typography>
            <Box mt={2} />
            <RHFTextField
              name="credentialID"
              placeholder="Credential ID"
              size="small"
              inputProps={{ maxLength: 100 }}
            />
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Credential URL
            </Typography>
            <Box mt={2} />
            <RHFTextField
              name="credentialUrl"
              placeholder="Credential Url"
              size="small"
              inputProps={{ maxLength: 200 }}
            />
          </Box>
          <Divider />
          <Stack direction="row" justifyContent="space-between" sx={{ px: 2, pb: 3 }}>
            <Stack direction="row" alignItems="center">
              {userCertificate?.id && (
                <Button
                  sx={{ color: 'error.main', padding: '11px 33px' }}
                  onClick={() => handleNavigation(PATH_APP.profile.user.certificate.delete)}
                >
                  <Typography variant="button">Delete</Typography>
                </Button>
              )}
              <Link href={PATH_APP.profile.user.certificate.audience} passHref>
                <Button
                  variant="outlined"
                  startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                  endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
                >
                  <Typography color={theme.palette.text.primary}>
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(userCertificate?.audience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
              </Link>
            </Stack>
            <LoadingButton
              loading={isLoading}
              type="submit"
              variant="contained"
              disabled={!isValid || !(isDirty || userCertificate?.isChange)}
            >
              {userCertificate?.id ? 'save' : 'Add'}
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}

export default AddCertificateDialog;
