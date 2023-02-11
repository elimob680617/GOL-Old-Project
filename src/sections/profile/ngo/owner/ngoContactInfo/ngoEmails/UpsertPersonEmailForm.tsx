import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowDown2, ArrowLeft, Eye } from 'iconsax-react';
import Link from 'next/link';
import { useRouter, withRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AudienceEnum, VerificationStatusEnum } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import { addedEmail, emptyEmail, userEmailsSelector } from 'src/redux/slices/profile/contactInfo-slice-eli';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useUpsertUserEmailMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertUserEmail.generated';
import * as Yup from 'yup';

type EmailValueProps = {
  id?: string;
  email: string;
  audience: AudienceEnum;
  status?: VerificationStatusEnum;
};

function UpsertPersonEmailForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const personEmail = useSelector(userEmailsSelector);
  const [upsertUserEmail, { isLoading }] = useUpsertUserEmailMutation();

  useEffect(() => {
    if (!personEmail) router.push(PATH_APP.profile.ngo.contactInfo.root);
  }, [personEmail, router]);

  const EmailSchema = Yup.object().shape({
    email: Yup.string().email().required('Please fill out this field.'),
  });

  const defaultValues = {
    id: personEmail?.id,
    email: personEmail?.email || '',
    audience: personEmail?.audience || AudienceEnum.Public,
    status: personEmail?.status || VerificationStatusEnum.Pending,
  };

  const methods = useForm<EmailValueProps>({
    mode: 'onSubmit',
    // reValidateMode: 'onChange',
    resolver: yupResolver(EmailSchema),
    defaultValues,
  });

  const {
    getValues,
    handleSubmit,
    formState: {},
  } = methods;

  const closeHandler = async () => {
    if (personEmail?.id) {
      router.push(PATH_APP.profile.ngo.root);
    } else {
      router.push(PATH_APP.profile.ngo.contactInfo.root);
      await sleep(1500);
      dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    }
  };

  const onSubmit = async (data: EmailValueProps) => {
    const { id, email, audience, status } = data;
    const resData: any = await upsertUserEmail({
      filter: {
        dto: {
          id: id,
          email: email,
          audience: audience,
        },
      },
    });

    if (resData?.data?.upsertUserEmail?.isSuccess) {
      dispatch(
        addedEmail({
          status,
          id,
          email,
          audience,
        })
      );

      router.push(PATH_APP.profile.ngo.contactInfo.email.verify);
      await sleep(1500);
      dispatch(addedEmail({ audience: AudienceEnum.Public }));
    }
    if (!resData?.data?.upsertUserEmail?.isSuccess) {
      enqueueSnackbar(resData?.data?.upsertUserEmail?.messagingKey, { variant: 'error' });
    }
  };

  const handleBackRoute = async () => {
    router.push(PATH_APP.profile.ngo.contactInfo.root);
    await sleep(1500);
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
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
              {!personEmail?.id ? 'Add Email' : 'Edit Email'}
            </Typography>
            {!personEmail?.id ? (
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

          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Email
            </Typography>
            {!personEmail?.id ? (
              <RHFTextField autoComplete="Email" placeholder="Email" type="text" name="email" size="small" />
            ) : (
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">
                    {personEmail?.email}
                  </Typography>
                  <Typography variant="caption" color="primary">
                    {personEmail?.status}
                  </Typography>
                </Box>
              </Stack>
            )}
          </Stack>
          <Divider />

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              justifyContent: 'space-between',
              px: 2,
              ...(personEmail?.id && {
                justifyContent: 'unset',
                px: 6,
              }),
            }}
          >
            {personEmail?.id && (
              <Link href={PATH_APP.profile.ngo.contactInfo.email.delete} passHref>
                <Button variant="text" color="error">
                  Delete
                </Button>
              </Link>
            )}

            <Button
              variant="outlined"
              startIcon={<Icon name="Earth" />}
              endIcon={<Icon name="down-arrow" color="error.main" />}
              onClick={() => {
                dispatch(addedEmail(getValues()));
                router.push(PATH_APP.profile.ngo.contactInfo.email.audience);
              }}
            >
              <Typography color="text.primary">
                {Object.keys(AudienceEnum)
                  [Object.values(AudienceEnum).indexOf(personEmail?.audience as AudienceEnum)]?.replace(
                    /([A-Z])/g,
                    ' $1'
                  )
                  .trim()}
              </Typography>
            </Button>

            {!personEmail?.id && (
              <LoadingButton type="submit" variant="contained" loading={isLoading}>
                Add
              </LoadingButton>
            )}
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}

export default withRouter(UpsertPersonEmailForm);
