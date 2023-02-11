import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
// components
import { ArrowDown2, ArrowLeft, CloseSquare, Eye } from 'iconsax-react';
// next
import Link from 'next/link';
import { useRouter, withRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { AudienceEnum, VerificationStatusEnum } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { addedEmail, emptyEmail, userEmailsSelector } from 'src/redux/slices/profile/contactInfo-slice-eli';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUpsertUserEmailMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertUserEmail.generated';
import * as Yup from 'yup';

type EmailValueProps = {
  id?: string;
  email: string;
  audience: AudienceEnum;
  status?: VerificationStatusEnum;
};

function UpsertPersonEmailForm() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [upsertUserEmail, { isLoading }] = useUpsertUserEmailMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const personEmail = useSelector(userEmailsSelector);

  useEffect(() => {
    if (!personEmail) router.push(PATH_APP.profile.user.contactInfo.root);
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

  const { getValues, handleSubmit } = methods;

  function closeHandler() {
    if (personEmail?.id) {
      // handleNavigation('/profile/email-discard-saveChange');
      router.push(PATH_APP.profile.user.root);
    } else {
      dispatch(emptyEmail({ audience: AudienceEnum.Public }));
      router.push(PATH_APP.profile.user.contactInfo.root);
    }
  }

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

    if (resData.data?.upsertUserEmail?.isSuccess) {
      dispatch(
        addedEmail({
          status,
          id,
          email,
          audience,
        })
      );

      router.push(PATH_APP.profile.user.contactInfo.email.verify);
      // dispatch(addedEmail({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserEmail?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserEmail?.messagingKey, { variant: 'error' });
    }
  };

  const handleBackRoute = () => {
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
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
              {!personEmail?.id ? 'Add Email' : 'Edit Email'}
            </Typography>
            {!personEmail?.id ? (
              <IconButton onClick={handleBackRoute}>
                <CloseSquare variant="Outline" />
              </IconButton>
            ) : (
              <IconButton onClick={closeHandler}>
                <CloseSquare variant="Outline" />
              </IconButton>
            )}
          </Stack>
          <Divider />

          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Email
            </Typography>
            {!personEmail?.id ? (
              <RHFTextField
                autoComplete="Email"
                placeholder="Email"
                type="text"
                name="email"
                size="small"
                inputProps={{ maxLength: 100 }}
              />
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
              <Link href={PATH_APP.profile.user.contactInfo.email.delete} passHref>
                <Button variant="text" color="error">
                  Delete
                </Button>
              </Link>
            )}

            <Button
              variant="outlined"
              startIcon={<Eye size="18" color={theme.palette.text.primary} />}
              onClick={() => {
                dispatch(addedEmail(getValues()));
                router.push(PATH_APP.profile.user.contactInfo.email.audience);
              }}
              endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
            >
              <Typography color={theme.palette.text.primary}>
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
