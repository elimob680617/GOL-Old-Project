import { Box, Dialog, Divider, IconButton, Stack, Typography, Button, useTheme } from '@mui/material';
import { ArrowDown2, ArrowLeft, CloseSquare, Eye } from 'iconsax-react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { dispatch, useSelector } from 'src/redux/store';
import {
  RelationShipCleared,
  userRelationShipSelector,
  userRelationShipUpdate,
} from 'src/redux/slices/profile/userRelationShip-slice';
import { FormProvider } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { AudienceEnum, Relationship } from 'src/@types/sections/serverTypes';
import { useUpdateRelationshipMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updateRelationship.generated';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { PATH_APP } from 'src/routes/paths';

function AddRelationship() {
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const relationShip = useSelector(userRelationShipSelector);
  const isEdit = !!relationShip?.personId;

  const [updateRelationship, { isLoading }] = useUpdateRelationshipMutation();
  const onSubmit = async (data: Relationship) => {
    const resData: any = await updateRelationship({
      filter: {
        dto: {
          audience: data.audience,
          relationshipStatusId: data.relationshipStatus?.id,
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

  const defaultValues = {
    personId: relationShip?.personId,
    audience: relationShip?.audience,
    relationshipStatus: relationShip?.relationshipStatus,
  };
  const methods = useForm<Relationship>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    handleSubmit,
    formState: {},
  } = methods;

  const handelCloseDialog = () => {
    if (
      (relationShip?.relationshipStatus?.title && !getValues().personId) ||
      (relationShip?.relationshipStatus?.title && relationShip?.isChange)
    ) {
      router.push(PATH_APP.profile.user.publicDetails.relationship.discard);
    } else {
      dispatch(userRelationShipUpdate({ audience: AudienceEnum.Public }));
      router.push(PATH_APP.profile.user.publicDetails.root);
    }
  };

  const router = useRouter();
  useEffect(() => {
    if (!relationShip) router.push(PATH_APP.profile.user.publicDetails.root);
  }, [relationShip, router]);
  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => handelCloseDialog()}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ minWidth: 600, minHeight: 234, py: 3 }}>
          <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
                <ArrowLeft />
              </IconButton>

              <Typography variant="subtitle1" color="text.primary">
                {isEdit ? 'Edit Relationship Status' : ' Set Relationship Status'}
              </Typography>
            </Box>
            <IconButton onClick={handelCloseDialog}>
              <CloseSquare />
            </IconButton>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Relationship status
            </Typography>

            <Link href={PATH_APP.profile.user.publicDetails.relationship.relationshipStatus} passHref>
              <Button
                color="inherit"
                size="large"
                variant="outlined"
                sx={{ borderColor: 'text.disabled' }}
                endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              >
                <Typography color="text.primary" variant="button">
                  {relationShip?.relationshipStatus?.title ? relationShip?.relationshipStatus?.title : 'relationship'}
                </Typography>
              </Button>
            </Link>
          </Stack>
          <Divider />

          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ px: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box>
                {isEdit && (
                  <Link href={PATH_APP.profile.user.publicDetails.relationship.delete} passHref>
                    <Button color="error">
                      <Typography variant="button">Delete</Typography>
                    </Button>
                  </Link>
                )}
              </Box>
              <Box>
                <Link href={PATH_APP.profile.user.publicDetails.relationship.audience} passHref>
                  <Button
                    variant="outlined"
                    startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                    endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
                  >
                    <Typography color={theme.palette.text.primary}>
                      {
                        Object.keys(AudienceEnum)[
                          Object.values(AudienceEnum).indexOf(relationShip?.audience as AudienceEnum)
                        ]
                      }
                    </Typography>
                  </Button>
                </Link>
              </Box>
            </Box>

            <Box>
              <LoadingButton
                loading={isLoading}
                type="submit"
                color="primary"
                variant="contained"
                disabled={!relationShip?.relationshipStatus?.title || !relationShip?.isChange}
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

export default AddRelationship;
