import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Button, Dialog, Divider, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import { ArrowDown2, ArrowLeft, CloseSquare, Eye } from 'iconsax-react';
import Link from 'next/link';
// components
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useSelector } from 'react-redux';
import { UserPhoneNumberType } from 'src/@types/sections/profile/userPhoneNumber';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import PhoneNumber from 'src/components/PhoneNumber';
import {
  phoneNumberAdded,
  phoneNumberCleared,
  userPhoneNumberSelector,
} from 'src/redux/slices/profile/userPhoneNumber-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
// Queries and Mutations
import { useUpsertPhoneNumberMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertPhoneNumber.generated';
import * as Yup from 'yup';

const ParentPhoneInputStyle = styled(Stack)(({ theme }) => ({
  //   border: ({ isError }) => (isError ? `1px solid ${error.main}` : `1px solid ${neutral[200]}`),
  justifyContent: 'space-between',
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingBottom: 95,
  display: 'flex',
  //   alignItems: 'center',
  height: 40,
  position: 'relative',
  borderRadius: 8,
  '&:focus-within': {
    // border: ({ isError }) => (isError ? `2px solid ${error.main}` : `2px solid ${primary[900]}`),
  },
}));

function UpsertPhoneNumber() {
  const router = useRouter();
  const theme = useTheme();
  const userPhoneNumber = useSelector(userPhoneNumberSelector);
  const [addUserPhoneNumber, { isLoading }] = useUpsertPhoneNumberMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!userPhoneNumber) router.push(PATH_APP.profile.user.contactInfo.root);
  }, [userPhoneNumber, router]);

  const PhoneNumberSchema = Yup.object().shape({
    phoneNumber: Yup.string().test('phoneNumber', 'Invalid Phone Number', function (value: any) {
      const isValidPhone = isValidPhoneNumber(value || '');
      if (!isValidPhone || value?.length < 10) {
        return false;
      }
      return true;
    }),
  });

  const defaultValues = {
    id: userPhoneNumber?.id,
    audience: userPhoneNumber?.audience,
    phoneNumber: userPhoneNumber?.phoneNumber || '',
    status: userPhoneNumber?.status,
    verificationCode: userPhoneNumber?.verificationCode,
  };

  const methods = useForm<UserPhoneNumberType>({
    resolver: yupResolver(PhoneNumberSchema),
    defaultValues,
    mode: 'onSubmit',
    // reValidateMode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: UserPhoneNumberType) => {
    const { id, phoneNumber, audience, status } = data;

    const resData: any = await addUserPhoneNumber({
      filter: {
        dto: {
          id: id,
          phoneNumber: phoneNumber,
          audience: audience,
        },
      },
    });

    if (resData.data?.upsertPhoneNumber?.isSuccess) {
      dispatch(
        phoneNumberAdded({
          status,
          id,
          phoneNumber,
          audience,
          // verificationCode: resData.data?.upsertPhoneNumber?.listDto?.items?.[0].verificationCode,
        })
      );
      router.push(PATH_APP.profile.user.contactInfo.phoneNumber.verify);
    }

    // if (!resData.data?.upsertPhoneNumber?.isSuccess) {
    //   console.log(resData.data?.upsertPhoneNumber?.messagingKey);
    //   enqueueSnackbar(resData.data?.upsertPhoneNumber?.messagingKey, { variant: 'error' });
    // }
  };

  const handleDialogDeletePhoneNumber = () => {
    router.push(PATH_APP.profile.user.contactInfo.phoneNumber.delete);
  };

  const handleNavigation = (url: string) => {
    dispatch(phoneNumberAdded(getValues()));
    router.push(url);
  };

  function closeHandler() {
    if (userPhoneNumber?.id) {
      handleNavigation(PATH_APP.profile.user.root);
    } else {
      dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
      router.push(PATH_APP.profile.user.contactInfo.root);
    }
  }

  const handleBackRoute = () => {
    dispatch(phoneNumberCleared());
    router.push(PATH_APP.profile.user.contactInfo.root);
  };

  const handleUpdateAudience = () => {};

  return (
    <>
      <Dialog fullWidth={true} open={true} keepMounted sx={{ minWidth: 600 }} onClose={handleBackRoute}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
              <Stack spacing={2} direction="row" alignItems="center">
                <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
                  <ArrowLeft />
                </IconButton>
                <Typography variant="subtitle1" color="text.primary">
                  {userPhoneNumber?.id ? 'Edit Phone Number' : 'Phone Number'}
                </Typography>
              </Stack>
              {!userPhoneNumber?.id ? (
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
            <ParentPhoneInputStyle>
              <Stack sx={{ mt: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Phone Number
                </Typography>
                {!userPhoneNumber?.id ? (
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <PhoneNumber
                        value={field.value as string}
                        isError={!!errors?.phoneNumber}
                        placeHolder="Enter phone number"
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                ) : (
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, paddingBottom: 0 }}>
                    <Typography variant="body2">{userPhoneNumber.phoneNumber}</Typography>
                    <Typography variant="body2" color="primary">
                      {userPhoneNumber.status}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              {!!errors?.phoneNumber && (
                <Typography component="div" variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>
                  {errors?.phoneNumber?.message}
                </Typography>
              )}
            </ParentPhoneInputStyle>
            <Divider sx={{ mt: !!errors?.phoneNumber ? '32px !important' : '16px !important' }} />
            {!userPhoneNumber?.id ? (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
                <Link href={PATH_APP.profile.user.contactInfo.phoneNumber.audience} passHref>
                  <Button
                    variant="outlined"
                    startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                    onClick={handleUpdateAudience}
                    endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
                  >
                    <Typography color={theme.palette.text.primary}>
                      {
                        Object.keys(AudienceEnum)[
                          Object.values(AudienceEnum).indexOf(userPhoneNumber?.audience as AudienceEnum)
                        ]
                      }
                    </Typography>
                  </Button>
                </Link>
                <LoadingButton loading={isLoading} type="submit" variant="contained">
                  Add
                </LoadingButton>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 6 }}>
                <Button variant="text" color="error" onClick={() => handleDialogDeletePhoneNumber()}>
                  Delete
                </Button>
                <Link href={PATH_APP.profile.user.contactInfo.phoneNumber.audience} passHref>
                  <Button
                    variant="outlined"
                    startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                    onClick={handleUpdateAudience}
                    endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
                  >
                    <Typography color={theme.palette.text.primary}>
                      {
                        Object.keys(AudienceEnum)[
                          Object.values(AudienceEnum).indexOf(userPhoneNumber?.audience as AudienceEnum)
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

export default UpsertPhoneNumber;
