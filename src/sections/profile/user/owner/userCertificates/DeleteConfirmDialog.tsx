import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, CloseSquare, Save2, TrushSquare } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { certificateCleared, userCertificateSelector } from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useDeleteCertificateMutation } from 'src/_requests/graphql/profile/certificates/mutations/deleteCertificate.generated';

function DeleteConfirmDialog() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const userCertificate = useSelector(userCertificateSelector);
  const [deleteCertificate, { isLoading }] = useDeleteCertificateMutation();

  // functions !
  const handleDeleteCertificate = async () => {
    const resDeleteData: any = await deleteCertificate({
      filter: {
        dto: {
          id: userCertificate?.id,
        },
      },
    });
    if (resDeleteData?.data?.deleteCertificate?.isSuccess) {
      enqueueSnackbar('The certificate has been successfully deleted', { variant: 'success' });
      dispatch(certificateCleared());
      router.push(PATH_APP.profile.user.certificate.root);
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };

  function handleDiscardCertificate() {
    dispatch(certificateCleared());
    router.push(PATH_APP.profile.user.certificate.root);
  }

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Are you sure to delete the current certificate?
            </Typography>
          </Box>
          <Link href={PATH_APP.profile.user.certificate.root} passHref>
            <IconButton>
              <CloseSquare />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2, justifyContent: 'left' }}>
          <LoadingButton
            loading={isLoading}
            startIcon={<TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />}
            variant="text"
            color="error"
            onClick={handleDeleteCertificate}
            sx={{ maxWidth: 205 }}
          >
            <Typography variant="body2" color="error">
              Delete Current Certificate
            </Typography>
          </LoadingButton>
          <Button
            color="inherit"
            sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}
            onClick={handleDiscardCertificate}
          >
            <Save2 fontSize="24" variant="Outline" />
            <Typography variant="body2" color="text.primary">
              Discard
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default DeleteConfirmDialog;
