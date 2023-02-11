import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AudienceEnum, SocialMedia } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import {
  addedSocialMedia,
  emptySocialMedia,
  userSocialMediasSelector,
} from 'src/redux/slices/profile/socialMedia-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useUpsertUserSocialMediaMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertUserSocialMedia.generated';
import * as Yup from 'yup';

type SocialMediaValueProps = {
  id?: string;
  socialMediaDto: SocialMedia;
  audience: AudienceEnum;
  userName: string;
};

function AddSocialLinkNewForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const personSocialMedia = useSelector(userSocialMediasSelector);
  const [upsertUserSocialMedia] = useUpsertUserSocialMediaMutation();

  useEffect(() => {
    if (!personSocialMedia) router.push(PATH_APP.profile.ngo.contactInfo.root);
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
  // click on closeicon and go to Discard or profile
  const handlePlatformClick = () => {
    dispatch(addedSocialMedia(getValues()));
    router.push(PATH_APP.profile.ngo.contactInfo.socialLink.platform);
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
      router.push(PATH_APP.profile.ngo.contactInfo.root);
      enqueueSnackbar('The Social link has been successfully added', { variant: 'success' });
      await sleep(1500);
      dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserSocialMedia?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserSocialMedia?.messagingKey, { variant: 'error' });
    }
  };
  const handleBackRoute = async () => {
    router.push(PATH_APP.profile.ngo.contactInfo.root);
    await sleep(1500);
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleBackRoute}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
                <Icon name="left-arrow-1" />
              </IconButton>
              {!personSocialMedia?.id ? 'Social Link' : 'Edit Social Link'}
            </Typography>
            <IconButton onClick={handleBackRoute}>
              <Icon name="Close-1" />
            </IconButton>
            {/* {!personSocialMedia?.userName ? (
            ) : (
              <IconButton onClick={handleBackRoute}>
                <CloseCircle variant="Outline" />
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
                startIcon={<Icon name="down-arrow" />}
                variant="contained"
                onClick={handlePlatformClick}
              >
                <Typography variant="button">{personSocialMedia?.socialMediaDto?.title || 'Platform'}</Typography>
              </Button>
              <RHFTextField autoComplete="UserName" placeholder="Username" type="text" name="userName" size="small" />
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
              <Link href={PATH_APP.profile.ngo.contactInfo.socialLink.delete} passHref>
                <Button variant="text" color="error">
                  Delete
                </Button>
              </Link>
            )}

            <Button
              variant="outlined"
              startIcon={<Icon name="Earth" />}
              endIcon={<Icon name="down-arrow" color="error.main" />}
              onClick={(e) => {
                dispatch(addedSocialMedia(getValues()));
                router.push(PATH_APP.profile.ngo.contactInfo.socialLink.audience);
              }}
            >
              <Typography color="text.primary">
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
