import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowDown2, ArrowLeft, CloseSquare, Eye } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AudienceEnum, Location, LocationTypeEnum } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import { emptyLocation, userLocationSelector } from 'src/redux/slices/profile/userLocation-slice';
import { dispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useUpsertLocationMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/addCurrentCity.generated';

function AddHomeTown() {
  const router = useRouter();
  const theme = useTheme();

  const userCity = useSelector(userLocationSelector);
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!userCity?.id;
  const [upsertLocation, { isLoading }] = useUpsertLocationMutation();

  const onSubmit = async (data: Location) => {
    const result: any = await upsertLocation({
      filter: {
        dto: {
          audience: data.audience,
          cityId: data.city?.id,
          id: data.id,
          locationType: LocationTypeEnum.Hometown,
        },
      },
    });

    if (result?.data?.upsertLocation?.isSuccess) {
      enqueueSnackbar(
        isEdit ? 'The home town has been successfully edited' : 'The home town has been successfully added',
        { variant: 'success' }
      );
      router.back();
      dispatch(emptyLocation());
    }
  };
  const defaultValues = {
    id: userCity?.id,
    audience: userCity?.audience,
    city: userCity?.city,
  };
  const methods = useForm<Location>({
    defaultValues,
    mode: 'onChange',
  });

  const { getValues, handleSubmit } = methods;

  useEffect(() => {
    if (!userCity) router.push(PATH_APP.profile.user.publicDetails.root);
  }, [userCity, router]);

  const handelCloseDialog = async () => {
    if ((userCity?.city?.name && !getValues().id) || (userCity?.city?.name && userCity?.isChange)) {
      router.push(PATH_APP.profile.user.publicDetails.homeTown.discard);
    } else {
      router.push(PATH_APP.profile.user.publicDetails.root);
      await sleep(200);
      dispatch(emptyLocation());
    }
  };
  const handleUpdateAudience = () => {};

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => handelCloseDialog()}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ minWidth: 600, minHeight: 234, py: 3 }}>
          <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
                <ArrowLeft />
              </IconButton>
              {isEdit ? (
                <Typography variant="subtitle1" color="text.primary">
                  Edit Home Town
                </Typography>
              ) : (
                <Typography variant="subtitle1" color="text.primary">
                  Add Home Town
                </Typography>
              )}
            </Box>
            <IconButton onClick={handelCloseDialog}>
              <CloseSquare />
            </IconButton>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Home Town
            </Typography>

            <Link href={PATH_APP.profile.user.publicDetails.homeTown.homeTownName} passHref>
              <Typography
                variant="body2"
                color={userCity?.city?.name ? 'text.primary' : 'text.secondary'}
                sx={{ cursor: 'pointer' }}
              >
                {userCity?.city?.name || 'Home Town'}
              </Typography>
            </Link>
          </Stack>
          <Divider />

          {/* {isEdit ? ( */}
          <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isEdit && (
                <Link href={PATH_APP.profile.user.publicDetails.homeTown.delete} passHref>
                  <Button color="error">
                    <Typography variant="button">Delete</Typography>
                  </Button>
                </Link>
              )}
              <Link href={PATH_APP.profile.user.publicDetails.homeTown.audience} passHref>
                <Button
                  variant="outlined"
                  startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                  onClick={handleUpdateAudience}
                  endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
                >
                  <Typography color={theme.palette.text.primary}>
                    {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(userCity?.audience as AudienceEnum)]}
                  </Typography>
                </Button>
              </Link>
            </Box>
            <Box>
              <LoadingButton
                loading={isLoading}
                type="submit"
                color="primary"
                variant="contained"
                disabled={!userCity?.city?.name || !userCity.isChange}
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
export default AddHomeTown;
