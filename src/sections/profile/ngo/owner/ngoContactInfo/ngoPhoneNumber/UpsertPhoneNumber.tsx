import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, Divider, IconButton, Stack, styled, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useSelector } from 'react-redux';
import { UserPhoneNumberType } from 'src/@types/sections/profile/userPhoneNumber';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import PhoneNumber from 'src/components/PhoneNumber';
import {
  phoneNumberAdded,
  phoneNumberCleared,
  userPhoneNumberSelector,
} from 'src/redux/slices/profile/userPhoneNumber-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
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
  const dispatch = useDispatch();
  const userPhoneNumber = useSelector(userPhoneNumberSelector);
  const [addUserPhoneNumber, { isLoading }] = useUpsertPhoneNumberMutation();

  useEffect(() => {
    if (!userPhoneNumber) router.push(PATH_APP.profile.ngo.contactInfo.root);
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
        })
      );
      router.push(PATH_APP.profile.ngo.contactInfo.phoneNumber.verify);
      await sleep(1500);
      dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
    }
  };

  const handleDialogDeletePhoneNumber = () => {
    router.push(PATH_APP.profile.ngo.contactInfo.phoneNumber.delete);
  };

  const handleNavigation = (url: string) => {
    dispatch(phoneNumberAdded(getValues()));
    router.push(url);
  };

  const closeHandler = async () => {
    if (userPhoneNumber?.id) {
      handleNavigation(PATH_APP.profile.ngo.root);
    } else {
      router.push(PATH_APP.profile.ngo.contactInfo.root);
      await sleep(1500);
      dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
    }
  };

  const handleBackRoute = async () => {
    router.push(PATH_APP.profile.ngo.contactInfo.root);
    await sleep(1500);
    dispatch(phoneNumberCleared());
  };

  return (
    <>
      <Dialog fullWidth={true} open={true} keepMounted sx={{ minWidth: 600 }} onClose={handleBackRoute}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
              <Stack spacing={2} direction="row" alignItems="center">
                <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
                  <Icon name="left-arrow-1" />
                </IconButton>
                <Typography variant="subtitle1" color="text.primary">
                  {userPhoneNumber?.id ? 'Edit Phone Number' : 'Phone Number'}
                </Typography>
              </Stack>
              {!userPhoneNumber?.id ? (
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
                <Button
                  variant="outlined"
                  startIcon={<Icon name="Earth" />}
                  onClick={() => handleNavigation(PATH_APP.profile.ngo.contactInfo.phoneNumber.audience)}
                  endIcon={<Icon name="down-arrow" color="error.main" />}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(userPhoneNumber?.audience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
                <LoadingButton loading={isLoading} type="submit" variant="contained">
                  Add
                </LoadingButton>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 6 }}>
                <Button variant="text" color="error" onClick={() => handleDialogDeletePhoneNumber()}>
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleNavigation(PATH_APP.profile.ngo.contactInfo.phoneNumber.audience)}
                  startIcon={<Icon name="Earth" />}
                  endIcon={<Icon name="down-arrow" color="error.main" />}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(userPhoneNumber?.audience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
              </Stack>
            )}
          </Stack>
        </FormProvider>
      </Dialog>
    </>
  );
}

export default UpsertPhoneNumber;
