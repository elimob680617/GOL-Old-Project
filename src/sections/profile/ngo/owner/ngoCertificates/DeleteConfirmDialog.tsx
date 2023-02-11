import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, CloseCircle, Save2, TrushSquare } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Icon } from 'src/components/Icon';
import { certificateCleared, userCertificateSelector } from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useDeleteCertificateMutation } from 'src/_requests/graphql/profile/certificates/mutations/deleteCertificate.generated';

function DeleteConfirmDialog() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const router = useRouter();
  const userCertificate = useSelector(userCertificateSelector);
  const [deleteCertificate, { isLoading }] = useDeleteCertificateMutation();

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
      router.push(PATH_APP.profile.ngo.certificate.root);
      dispatch(certificateCleared());
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };

  function handleDiscardCertificate() {
    router.push(PATH_APP.profile.ngo.certificate.root);
    dispatch(certificateCleared());
  }

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Are you sure to delete the current certificate?
            </Typography>
          </Box>
          <Link href={PATH_APP.profile.ngo.certificate.root} passHref>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2, justifyContent: 'left', alignItems: 'flex-start' }}>
          <LoadingButton
            loading={isLoading}
            startIcon={<Icon name="trash" color="error.main" />}
            variant="text"
            color="error"
            onClick={handleDeleteCertificate}
          >
            <Typography variant="body2" color="error">
              Delete Current Certificate
            </Typography>
          </LoadingButton>
          <Button color="inherit" onClick={handleDiscardCertificate} startIcon={<Icon name="Close-1" />}>
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
