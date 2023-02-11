import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PersonWebSiteType } from 'src/@types/sections/profile/userWebsite';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import { userWebsiteSelector, websiteAdded } from 'src/redux/slices/profile/userWebsite-slice';
import { dispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useUpsertWebsiteMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertWebsite.generated';
import * as Yup from 'yup';

function UpsertWebsite() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const userWebsite = useSelector(userWebsiteSelector);
  const [addPersonWebsite, { isLoading }] = useUpsertWebsiteMutation();

  useEffect(() => {
    if (!userWebsite) router.push(PATH_APP.profile.ngo.contactInfo.root);
  }, [userWebsite, router]);

  const WebsiteSchema = Yup.object().shape({
    webSiteUrl: Yup.string()
      .required('Please fill out this field.')
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Please use a valid website url'
      ),
  });

  const defaultValues = {
    id: userWebsite?.id,
    audience: userWebsite?.audience,
    webSiteUrl: userWebsite?.webSiteUrl || '',
  };

  const methods = useForm<PersonWebSiteType>({
    resolver: yupResolver(WebsiteSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    getValues,
    formState: { isValid },
  } = methods;

  const onSubmit = async (data: PersonWebSiteType) => {
    const resData: any = await addPersonWebsite({
      filter: {
        dto: {
          id: data.id,
          webSiteUrl: data.webSiteUrl,
          audience: data.audience,
        },
      },
    });

    if (resData?.data?.upsertWebSite?.isSuccess) {
      dispatch(
        websiteAdded({
          id: data.id,
          webSiteUrl: data.webSiteUrl,
          audience: data.audience,
        })
      );
      router.push(PATH_APP.profile.ngo.contactInfo.root);
      enqueueSnackbar('The website has been successfully added', { variant: 'success' });
      await sleep(1500);
      dispatch(websiteAdded({ audience: AudienceEnum.Public }));
    }
    // else {
    //   enqueueSnackbar('The website has been successfully <deleted | edited>', { variant: 'error' });
    // }
  };

  const handleDialogDeleteWebsite = () => {
    router.push(PATH_APP.profile.ngo.contactInfo.website.delete);
  };

  const handleNavigation = (url: string) => {
    dispatch(websiteAdded(getValues()));
    router.push(url);
  };

  const closeHandler = async () => {
    if (isValid) {
      handleNavigation(PATH_APP.profile.ngo.contactInfo.website.discard);
    } else {
      router.push(PATH_APP.profile.ngo.contactInfo.root);
      await sleep(1500);
      dispatch(websiteAdded({ audience: AudienceEnum.Public }));
    }
  };

  const handleBackRoute = async () => {
    // if(isDirty){
    //   router.push(PATH_APP.profile.ngo.contactInfo.website.discard);
    // }else{
    router.push(PATH_APP.profile.ngo.contactInfo.root);
    await sleep(1500);
    dispatch(websiteAdded({ audience: AudienceEnum.Public }));
    // }
  };

  const handleUpdateAudience = () => {};

  return (
    <>
      <Dialog fullWidth={true} open={true} keepMounted onClose={handleBackRoute}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
              <Stack spacing={2} direction="row" alignItems="center">
                <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
                  <Icon name="left-arrow-1" />
                </IconButton>
                <Typography variant="subtitle1" color="text.primary">
                  {userWebsite?.id ? 'Edit Website' : 'Add Website'}
                </Typography>
              </Stack>
              {!userWebsite?.id ? (
                <IconButton onClick={handleBackRoute}>
                  <Icon name="Close-1" />
                </IconButton>
              ) : (
                <IconButton onClick={closeHandler}>
                  <Icon name="Close-1" />
                </IconButton>
              )}
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ justifyContent: 'space-between', px: 2 }}>
              <Typography variant="subtitle1">Website</Typography>
              {!userWebsite?.id ? (
                <RHFTextField autoComplete="WebSiteUrl" type="text" name="webSiteUrl" placeholder="Website" />
              ) : (
                <Stack spacing={2}>
                  <Typography variant="body1">{userWebsite.webSiteUrl}</Typography>
                </Stack>
              )}
            </Stack>
            <Divider />
            {!userWebsite?.id ? (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
                <Link href={PATH_APP.profile.ngo.contactInfo.website.audience} passHref>
                  <Button
                    variant="outlined"
                    startIcon={<Icon name="Earth" />}
                    endIcon={<Icon name="down-arrow" color="error.main" />}
                    onClick={handleUpdateAudience}
                  >
                    <Typography color="text.primary">
                      {
                        Object.keys(AudienceEnum)[
                          Object.values(AudienceEnum).indexOf(userWebsite?.audience as AudienceEnum)
                        ]
                      }
                    </Typography>
                  </Button>
                </Link>
                <LoadingButton type="submit" variant="contained" loading={isLoading} disabled={!isValid}>
                  Add
                </LoadingButton>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 6 }}>
                <Button variant="text" color="error" onClick={() => handleDialogDeleteWebsite()}>
                  Delete
                </Button>
                <Link href={PATH_APP.profile.ngo.contactInfo.website.audience} passHref>
                  <Button
                    variant="outlined"
                    startIcon={<Icon name="Earth" />}
                    endIcon={<Icon name="down-arrow" color="error.main" />}
                    onClick={handleUpdateAudience}
                  >
                    <Typography color="text.primary">
                      {
                        Object.keys(AudienceEnum)[
                          Object.values(AudienceEnum).indexOf(userWebsite?.audience as AudienceEnum)
                        ]
                      }
                    </Typography>
                  </Button>
                </Link>
              </Stack>
            )}
          </Stack>
        </FormProvider>
      </Dialog>
    </>
  );
}

export default UpsertWebsite;
