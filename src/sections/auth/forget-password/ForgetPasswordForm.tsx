import React from 'react';
import * as Yup from 'yup';
// next
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Typography, FormControl, RadioGroup, FormControlLabel, styled } from '@mui/material';
import Radio from '@mui/material/Radio';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from 'src/routes/paths';
// hooks
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'src/redux/store';
import { EmailOrPhoneNumberEnum } from 'src/@types/sections/serverTypes';
import { forgetPasswordUpdated, forgetPasswordUsernameSelector } from 'src/redux/slices/auth';
import { useForgetPasswordTokenMutation } from 'src/_requests/graphql/cognito/mutations/forgetPasswordToken.generated';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneNumber from 'src/components/PhoneNumber';

type ForgetPasswordFormProps = {
  username: string;
  usernameType: EmailOrPhoneNumberEnum;
  afterSubmit?: string;
};
const ParentPhoneInputStyle = styled(Stack)(({ theme }) => ({
  //   border: ({ isError }) => (isError ? `1px solid ${error.main}` : `1px solid ${neutral[200]}`),
  justifyContent: 'space-between',
  display: 'flex',
  height: 40,
  position: 'relative',
  borderRadius: 8,
  '&:focus-within': {
    // border: ({ isError }) => (isError ? `2px solid ${error.main}` : `2px solid ${primary[900]}`),
  },
}));

export default function ForgetPasswordForm() {
  const router = useRouter();

  const dispatch = useDispatch();

  const isMountedRef = useIsMountedRef();

  const forgetPasswordUser = useSelector(forgetPasswordUsernameSelector);

  const [forgottenPasswordUser] = useForgetPasswordTokenMutation();
  // const phoneRegExp =
  //   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const ForgetPasswordSchema = Yup.object().shape({
    username: Yup.string().test(
      'validateUsername',
      forgetPasswordUser.usernameType === EmailOrPhoneNumberEnum.Email
        ? 'Please use a valid email address.'
        : 'Please use a valid phone number address.',
      // userNameValidationMsg(emailMsg, phoneMsg, usernameType),
      function (value) {
        let emailRegex;
        // let phoneRegex
        if (forgetPasswordUser.usernameType === EmailOrPhoneNumberEnum.Email) {
          emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          const isValidEmail = emailRegex.test(value);
          if (!isValidEmail) {
            return false;
          }
        } else {
          const isValidPhone = isValidPhoneNumber(value || '');
          if (!isValidPhone) {
            return false;
          }
        }
        return true;
      }
    ),
  });

  const defaultValues = {
    ...forgetPasswordUser,
  };

  const methods = useForm<ForgetPasswordFormProps>({
    resolver: yupResolver(ForgetPasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    setError,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = methods;

  const handleEmailorPhoneNumber = (value) => {
    setValue('username', '');
    setValue('usernameType', value);
    dispatch(forgetPasswordUpdated({ username: '', usernameType: value }));
    // setError('username',{message:''})
  };

  const onSubmit = async (data: ForgetPasswordFormProps) => {
    try {
      dispatch(forgetPasswordUpdated({ ...forgetPasswordUser, username: data.username }));
      const result = await forgottenPasswordUser({
        ForgotPasswordTokenRequestDto: {
          dto: {
            userName: data.username,
            emailOrPhoneNumber: data.usernameType,
          },
        },
      });
      if ((result as any)?.data?.forgotPasswordToken?.isSuccess) {
        router.push(PATH_AUTH.confirmForgetPassword);
      }
    } catch (error) {
      // console.error(error);
      // if (isMountedRef.current) {
      //   setError('afterSubmit', error);
      // }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack my={3} spacing={3}>
        {/* {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>} */}
        <Stack flexDirection="row">
          <FormControl>
            <RadioGroup
              onChange={(e) => handleEmailorPhoneNumber((e.target as HTMLInputElement).value)}
              value={forgetPasswordUser.usernameType}
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              defaultValue={EmailOrPhoneNumberEnum.Email}
            >
              <Stack direction="row">
                <FormControlLabel
                  value={EmailOrPhoneNumberEnum.Email}
                  control={<Radio />}
                  label={
                    <Typography variant="caption" color="grey.700">
                      Using Email
                    </Typography>
                  }
                  sx={{ ml: '8px !important', mt: '8px !important' }}
                />
                <FormControlLabel
                  value={EmailOrPhoneNumberEnum.PhoneNumber}
                  control={<Radio />}
                  label={
                    <Typography variant="caption" color="grey.700">
                      Using Phone Number
                    </Typography>
                  }
                  sx={{ ml: '8px !important', mt: '8px !important' }}
                />
              </Stack>
            </RadioGroup>
          </FormControl>
        </Stack>
        {/* {userType === UserTypeEnum.Normal && <NormalUserInfoForm />} */}
        {forgetPasswordUser.usernameType === EmailOrPhoneNumberEnum.Email && (
          <RHFTextField size="small" autoComplete="username" name="username" placeholder="Email address" />
        )}
        {forgetPasswordUser.usernameType === EmailOrPhoneNumberEnum.PhoneNumber && (
          <ParentPhoneInputStyle>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <PhoneNumber
                  value={field.value}
                  isError={!!errors.username}
                  placeHolder="Enter phone number"
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </ParentPhoneInputStyle>
        )}
      </Stack>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={!isValid || !getValues()?.username?.length}
      >
        Continue
      </LoadingButton>
    </FormProvider>
  );
}
