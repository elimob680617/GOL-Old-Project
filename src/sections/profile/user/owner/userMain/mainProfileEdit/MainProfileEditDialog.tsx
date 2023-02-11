import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { Add, CloseSquare, Edit2 } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PersonInput, ProfileFieldEnum } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import { updateMainInfo, userMainInfoSelector, mainInfoCleared } from 'src/redux/slices/profile/userMainInfo-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import {
  useUpdatePersonProfileMutation,
  useUpdateProfileFiledMutation,
} from 'src/_requests/graphql/profile/mainProfile/mutations/updatePersonProfile.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';

const AvatarStyle = styled(Box)(() => ({
  position: 'absolute',
  left: 24,
  bottom: -36,
}));

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(0, -50%)',
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

function MainProfileEditDialog() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { initialize } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const userMainInfo = useSelector(userMainInfoSelector);
  const [getUser, { data: userData, isFetching: userFetching }] = useLazyGetUserDetailQuery();
  const [updateProfile, { isLoading }] = useUpdatePersonProfileMutation();
  const [updateProfileField, { isLoading: isLoadingField }] = useUpdateProfileFiledMutation();

  const fromWizard = localStorage.getItem('fromWizard') === 'true';
  const fromHomePage = localStorage.getItem('fromHomePage') === 'true';

  useEffect(() => {
    if (!userMainInfo)
      getUser({
        filter: {
          dto: {},
        },
      });
  }, [getUser, userMainInfo]);

  const user = userData?.getUser?.listDto?.items?.[0];

  const methods = useForm<PersonInput & { headlineView?: boolean }>({
    // resolver: yupResolver(ExperienceFormSchema),
    defaultValues: { ...userMainInfo, headlineView: true },
    mode: 'onBlur',
  });
  const {
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (user && !userMainInfo && !userFetching) {
      dispatch(
        updateMainInfo({
          avatarUrl: user?.personDto?.avatarUrl,
          birthday: user?.personDto?.birthday,
          coverUrl: user?.personDto?.coverUrl,
          gender: user?.personDto?.gender,
          headline: user?.personDto?.headline,
        })
      );
      reset({
        avatarUrl: user?.personDto?.avatarUrl,
        birthday: user?.personDto?.birthday,
        coverUrl: user?.personDto?.coverUrl,
        gender: user?.personDto?.gender,
        headline: user?.personDto?.headline,
        headlineView: true,
      });
    }
  }, [dispatch, reset, user, userFetching, userMainInfo]);

  const onSubmit = async (value: PersonInput) => {
    let birthdayValue;
    if (value?.birthday) {
      const date = new Date(value?.birthday);
      birthdayValue = `${date.getFullYear()}-${('0' + (date?.getMonth() + 1)).slice(-2)}-${(
        '0' + date?.getDate()
      ).slice(-2)}`;
    }
    const res: any = await updateProfile({
      filter: {
        dto: {
          birthday: birthdayValue,
          gender: value.gender,
          headline: value.headline,
        },
      },
    });

    const resCover: any = await updateProfileField({
      filter: {
        dto: {
          field: ProfileFieldEnum.CoverUrl,
          coverUrl: value.coverUrl,
        },
      },
    });

    const resAvatar: any = await updateProfileField({
      filter: {
        dto: {
          field: ProfileFieldEnum.AvatarUrl,
          avatarUrl: value.avatarUrl,
        },
      },
    });

    if (
      res?.data?.updatePersonProfile?.isSuccess &&
      resCover?.data?.updateProfileFiled?.isSuccess &&
      resAvatar?.data?.updateProfileFiled?.isSuccess
    ) {
      enqueueSnackbar('Profile Updated', { variant: 'success' });
      // initialize();
      if (fromWizard) {
        initialize();
        localStorage.removeItem('fromWizard');
        if (fromHomePage) {
          router.push(PATH_APP.home.wizard.wizardList);
        } else {
          router.push(PATH_APP.profile.user.wizard.wizardList);
        }
      } else {
        router.push(PATH_APP.profile.user.root);
      }
      setTimeout(() => {
        dispatch(mainInfoCleared());
      }, 100);
    }
  };

  const handleRouting = (url: string) => {
    dispatch(updateMainInfo(getValues()));
    router.push(url);
  };

  const handleClose = () => {
    if (isDirty) {
      handleRouting(PATH_APP.profile.user.userEditDiscard);
    } else {
      if (fromWizard) {
        initialize();
        localStorage.removeItem('fromWizard');
        if (fromHomePage) {
          router.push(PATH_APP.home.wizard.wizardList);
        } else {
          router.push(PATH_APP.profile.user.wizard.wizardList);
        }
      } else {
        router.push(PATH_APP.profile.user.root);
      }
      setTimeout(() => {
        dispatch(mainInfoCleared());
      }, 100);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={handleClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">Edit Profile</Typography>
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ padding: 0 }} onClick={handleClose}>
              <CloseSquare color={theme.palette.text.primary} />
            </IconButton>
          </Stack>
        </Stack>
        <Divider />
        {userFetching ? (
          <Stack alignItems="center" justifyContent="center" sx={{ height: 200 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack>
            <Box sx={{ position: 'relative' }}>
              <Box>
                <CardMedia
                  component="img"
                  alt="Cover Image"
                  height={'250px'}
                  image={watch('coverUrl') || '/icons/empty_cover.svg'}
                />
                <IconButtonStyle
                  onClick={() =>
                    router.push(
                      watch('coverUrl')
                        ? PATH_APP.profile.user.mainProfileNChangePhotoCover
                        : PATH_APP.profile.user.userEditCover
                    )
                  }
                >
                  <Image src="/icons/camera2.svg" width={28} height={22} alt="avatar" />
                </IconButtonStyle>
              </Box>
              <AvatarStyle>
                <Box sx={{ position: 'relative', width: 80 }}>
                  <Avatar
                    alt={user?.personDto?.fullName || ''}
                    src={watch('avatarUrl') || undefined}
                    sx={{ width: 80, height: 80 }}
                  />

                  <IconButtonStyle
                    sx={{ left: '25%' }}
                    onClick={() =>
                      router.push(
                        watch('avatarUrl')
                          ? PATH_APP.profile.user.mainProfileNChangePhotoAvatar
                          : PATH_APP.profile.user.userEditAvatar
                      )
                    }
                  >
                    <Image src="/icons/camera2.svg" width={28} height={22} alt="avatar" />
                  </IconButtonStyle>
                </Box>
              </AvatarStyle>
            </Box>
            <Stack spacing={2} sx={{ pt: 9, pb: 3 }}>
              <Stack sx={{ px: 2 }} spacing={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle2">Headline</Typography>
                  {watch('headline') && watch('headlineView') && (
                    <IconButton onClick={() => setValue('headlineView', false)}>
                      <Edit2 size="16" color={theme.palette.text.primary} />
                    </IconButton>
                  )}
                </Box>
                {!watch('headline') && watch('headlineView') ? (
                  <Button variant="outlined" onClick={() => setValue('headlineView', false)}>
                    <Add color={theme.palette.text.primary} />
                    <Typography color="text.primary">Add Headline</Typography>
                  </Button>
                ) : watch('headlineView') ? (
                  <Typography color="text.primary" variant="body2" onClick={() => setValue('headlineView', false)}>
                    {watch('headline')}
                  </Typography>
                ) : (
                  <Box>
                    <RHFTextField
                      name="headline"
                      size="small"
                      placeholder="Add Headline"
                      inputProps={{ maxLength: 60 }}
                      onBlur={() => setValue('headlineView', true)}
                      autoFocus
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      component="div"
                      sx={{ width: '100%', textAlign: 'right' }}
                    >
                      {watch('headline')?.length || 0}/60
                    </Typography>
                  </Box>
                )}
              </Stack>
              <Divider />
              <Stack sx={{ px: 2 }} spacing={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle2">Birthday</Typography>
                  {watch('birthday') && (
                    <IconButton onClick={() => handleRouting(PATH_APP.profile.user.birthday)}>
                      <Edit2 size="16" color={theme.palette.text.primary} />
                    </IconButton>
                  )}
                </Box>
                {!watch('birthday') ? (
                  <Button variant="outlined" onClick={() => handleRouting(PATH_APP.profile.user.birthday)}>
                    <Add color={theme.palette.text.primary} />
                    <Typography color="text.primary">Add Birthday</Typography>
                  </Button>
                ) : (
                  <Typography color="text.secondary" variant="body2">
                    <Stack direction="row">
                      <Typography variant="body2" color="text.secondry">
                        {new Date(watch('birthday')).getDate()}, {getMonthName(new Date(watch('birthday')))},{' '}
                        {new Date(watch('birthday')).getFullYear()}
                        <IconButton onClick={() => setValue('birthday', undefined)} sx={{ ml: 1 }}>
                          &#215;
                        </IconButton>
                      </Typography>
                    </Stack>
                  </Typography>
                )}
              </Stack>
              <Divider />
              <Stack sx={{ px: 2 }} spacing={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle2">Gender</Typography>
                  {watch('gender') && (
                    <IconButton onClick={() => handleRouting(PATH_APP.profile.user.gender)}>
                      <Edit2 size="16" color={theme.palette.text.primary} />
                    </IconButton>
                  )}
                </Box>
                {!watch('gender') ? (
                  <Button variant="outlined" onClick={() => handleRouting(PATH_APP.profile.user.gender)}>
                    <Add color={theme.palette.text.primary} />
                    <Typography color="text.primary">Add Gender</Typography>
                  </Button>
                ) : (
                  <Typography color="text.primary" variant="body2">
                    {watch('gender')!.toString()[0] + watch('gender')!.substring(1).toLowerCase()}
                    <IconButton
                      onClick={() => {
                        setValue('gender', undefined);
                        dispatch(updateMainInfo({ ...getValues(), isChange: true }));
                      }}
                      sx={{ ml: 1 }}
                    >
                      &#215;
                    </IconButton>
                  </Typography>
                )}
              </Stack>
              <Divider />
              <Box display="flex" justifyContent="flex-end" sx={{ px: 2 }}>
                <LoadingButton loading={isLoading || isLoadingField} variant="contained" color="primary" type="submit">
                  <Typography variant="button">Save</Typography>
                </LoadingButton>
              </Box>
            </Stack>
          </Stack>
        )}
      </FormProvider>
    </Dialog>
  );
}

export default MainProfileEditDialog;
