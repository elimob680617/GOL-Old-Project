import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
// import { ArrowLeft, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Icon } from 'src/components/Icon';
import { certificateCleared, userCertificateSelector } from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useUpsertCertificateMutation } from 'src/_requests/graphql/profile/certificates/mutations/upsertCertificate.generated';
function DiscardCertificate() {
  const { enqueueSnackbar } = useSnackbar();
  const userCertificate = useSelector(userCertificateSelector);
  const [upsertCertificate, { isLoading }] = useUpsertCertificateMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDiscardCertificate = async () => {
    router.push(PATH_APP.profile.ngo.certificate.root);
    await sleep(1000);
    dispatch(certificateCleared());
  };

  const handleSaveOrContinueCertificate = async () => {
    if (!userCertificate?.isValid) {
      router.back();
    } else {
      const resData: any = await upsertCertificate({
        filter: {
          dto: {
            id: userCertificate?.id,
            certificateNameId: userCertificate?.certificateName?.id,
            issuingOrganizationId: userCertificate?.issuingOrganization?.id,
            credentialDoesExpire: !userCertificate?.credentialDoesExpire,
            issueDate: new Date(userCertificate?.issueDate).toISOString(),
            expirationDate: !userCertificate?.credentialDoesExpire ? userCertificate?.expirationDate : undefined,
            credentialID: userCertificate?.credentialID,
            credentialUrl: userCertificate?.credentialUrl,
            audience: userCertificate?.audience,
          },
        },
      });
      if (resData?.data?.upsertCertificate?.isSuccess) {
        enqueueSnackbar('The certificate has been successfully added ', { variant: 'success' });
        router.push(PATH_APP.profile.ngo.certificate.root);
        await sleep(1000);
        dispatch(certificateCleared());
      } else {
        enqueueSnackbar('It was not successful', { variant: 'error' });
      }
    }
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
              Do you want to {userCertificate?.isValid ? 'save changes' : 'continue'}?
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2, alignItems: 'flex-start' }}>
          <LoadingButton
            loading={isLoading}
            startIcon={<Icon name="Save" />}
            variant="text"
            color="inherit"
            onClick={handleSaveOrContinueCertificate}
          >
            <Typography variant="body2" color="text.primary">
              {userCertificate?.isValid ? 'Save Change' : 'Continue'}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="Close-1" color="error.main" />}
            onClick={handleDiscardCertificate}
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

export default DiscardCertificate;
