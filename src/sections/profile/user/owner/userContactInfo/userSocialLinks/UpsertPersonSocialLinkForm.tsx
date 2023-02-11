import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
// components
import { ArrowDown2, ArrowLeft, CloseSquare, Eye } from 'iconsax-react';
// next
import Link from 'next/link';
// hooks
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { AudienceEnum, SocialMedia } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import {
  addedSocialMedia,
  emptySocialMedia,
  userSocialMediasSelector,
} from 'src/redux/slices/profile/socialMedia-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUpsertUserSocialMediaMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertUserSocialMedia.generated';
import * as Yup from 'yup';

type SocialMediaValueProps = {
  id?: string;
  socialMediaDto: SocialMedia;
  audience: AudienceEnum;
  userName: string;
};

function AddSocialLinkNewForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [upsertUserSocialMedia] = useUpsertUserSocialMediaMutation();
  const router = useRouter();
  const personSocialMedia = useSelector(userSocialMediasSelector);
  const theme = useTheme();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!personSocialMedia) router.push(PATH_APP.profile.user.contactInfo.root);
  }, [personSocialMedia, router]);

  const SocialLinkSchema = Yup.object().shape({
    userName: Yup.string().required('Please fill out this field.'),
    socialMediaDto: Yup.object().shape({ title: Yup.string().required('') }),
  });

  const defaultValues = {
    id: personSocialMedia?.id,
    socialMediaDto: personSocialMedia?.socialMediaDto || undefined,
    audience: personSocialMedia?.audience || AudienceEnum.Public,
    userName: personSocialMedia?.userName || '',
  };

  const methods = useForm<SocialMediaValueProps>({
    mode: 'onChange',
    resolver: yupResolver(SocialLinkSchema),
    defaultValues,
  });
  const {
    getValues,
    handleSubmit,
    trigger,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    trigger(['socialMediaDto.title']);
  }, [trigger]);

  const handlePlatformClick = () => {
    dispatch(addedSocialMedia(getValues()));
    router.push(PATH_APP.profile.user.contactInfo.socialLink.platform);
  };

  const onSubmit = async (data: SocialMediaValueProps) => {
    const { id, userName, audience, socialMediaDto } = data;
    const resData: any = await upsertUserSocialMedia({
      filter: {
        dto: {
          id: id,
          userName: userName,
          socialMediaId: socialMediaDto?.id,
          audience: audience,
        },
      },
    });
    if (resData.data?.upsertUserSocialMedia?.isSuccess) {
      dispatch(
        addedSocialMedia({
          id: id,
          userName: userName,
          socialMediaDto: socialMediaDto,
          audience: audience,
        })
      );
      router.push(PATH_APP.profile.user.contactInfo.root);
      dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
      enqueueSnackbar('The Social link has been successfully added', { variant: 'success' });
    }
    if (!resData.data?.upsertUserSocialMedia?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserSocialMedia?.messagingKey, { variant: 'error' });
    }
  };
  const handleBackRoute = () => {
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    router.push(PATH_APP.profile.user.contactInfo.root);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleBackRoute}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
                <ArrowLeft />
              </IconButton>
              {!personSocialMedia?.id ? 'Social Link' : 'Edit Social Link'}
            </Typography>
            <IconButton onClick={handleBackRoute}>
              <CloseSquare variant="Outline" />
            </IconButton>
            {/* {!personSocialMedia?.userName ? (
            ) : (
              <IconButton onClick={handleBackRoute}>
                <CloseSquare variant="Outline" />
              </IconButton>
            )} */}
          </Stack>
          <Divider />
          {!personSocialMedia?.id ? (
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                Social Link
              </Typography>
              <Button
                fullWidth
                size="large"
                startIcon={<ArrowDown2 size="16" />}
                variant="contained"
                onClick={handlePlatformClick}
              >
                <Typography variant="button">{personSocialMedia?.socialMediaDto?.title || 'Platform'}</Typography>
              </Button>
              <RHFTextField
                autoComplete="UserName"
                placeholder="Username"
                type="text"
                name="userName"
                size="small"
                inputProps={{ maxLength: 50 }}
              />
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                {personSocialMedia?.socialMediaDto?.title}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {personSocialMedia?.userName}
              </Typography>
            </Stack>
          )}
          <Divider />
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              justifyContent: 'space-between',
              px: 2,
              ...(personSocialMedia?.id && {
                justifyContent: 'unset',
                px: 6,
              }),
            }}
          >
            {!!personSocialMedia?.id && (
              <Link href={PATH_APP.profile.user.contactInfo.socialLink.delete} passHref>
                <Button variant="text" color="error">
                  Delete
                </Button>
              </Link>
            )}

            <Button
              variant="outlined"
              startIcon={<Eye size="18" color={theme.palette.text.primary} />}
              onClick={(e) => {
                dispatch(addedSocialMedia(getValues()));
                router.push(PATH_APP.profile.user.contactInfo.socialLink.audience);
              }}
              endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
            >
              <Typography color={theme.palette.text.primary}>
                {Object.keys(AudienceEnum)
                  [Object.values(AudienceEnum).indexOf(personSocialMedia?.audience as AudienceEnum)]?.replace(
                    /([A-Z])/g,
                    ' $1'
                  )
                  .trim()}
              </Typography>
            </Button>
            {!personSocialMedia?.id && (
              <LoadingButton type="submit" variant="contained" disabled={!isValid}>
                Add
              </LoadingButton>
            )}
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}

export default AddSocialLinkNewForm;
