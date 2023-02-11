import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Alert, Box, IconButton, InputAdornment, Stack } from '@mui/material';
import { Eye, EyeSlash } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// form
import { Controller, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { EmailOrPhoneNumberEnum, UserTypeEnum } from 'src/@types/sections/serverTypes';
import PasswordStrength from 'src/components/PasswordStrength';
import PhoneNumber from 'src/components/PhoneNumber';
import {
  basicInfoSelector,
  signUpBySelector,
  signUpUserTypeSelector,
  updateSignUpBasicInfo,
} from 'src/redux/slices/auth';
import { useDispatch, useSelector } from 'src/redux/store';
import { useExistUserMutation } from 'src/_requests/graphql/cognito/mutations/existUser.generated';
import * as Yup from 'yup';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// ----------------------------------------------------------------------

type BasicInfoFormProps = {
  username: string;
  password: string;
  afterSubmit?: string;
};

export default function BaseInfoForm() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();

  // const signUpType = useSelector(signUpTypeSelector);
  const userSignUpBy = useSelector(signUpBySelector);
  const userType = useSelector(signUpUserTypeSelector) as UserTypeEnum;
  const { username, password } = useSelector(basicInfoSelector);

  const [checkUserExists] = useExistUserMutation();

  const SignUpSchema = Yup.object().shape({
    username: Yup.string().test(
      'validateUsername',
      userSignUpBy === 'email' ? 'Please use a valid email address.' : 'Please use a valid phone number address.',
      function (value) {
        let emailRegex;
        // let phoneRegex
        if (userSignUpBy === 'email') {
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
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    username,
    password,
  };

  const methods = useForm<BasicInfoFormProps>({
    resolver: yupResolver(SignUpSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const {
    // reset,

    setValue,
    setError,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const onSubmit = async ({ username, password }: BasicInfoFormProps) => {
    dispatch(updateSignUpBasicInfo({ username, password }));
    const result: any = await checkUserExists({
      data: {
        dto: {
          userName: username,
          password,
          emailOrPhone: userSignUpBy === 'email' ? EmailOrPhoneNumberEnum.Email : EmailOrPhoneNumberEnum.PhoneNumber,
          userType,
        },
      },
    });
    const res = result?.data?.existUser?.listDto?.items?.[0];
    if (res?.isExist) setError('afterSubmit', { message: res?.message });
    else router.push(PATH_AUTH.signUp.advancedInfo);
  };
  useEffect(() => {
    if (userSignUpBy) {
      setValue('username', '');
    }
  }, [userSignUpBy, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack mt={3} spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <Stack spacing={1}>
          {userSignUpBy === 'email' ? (
            <RHFTextField
              size="small"
              autoComplete="new-password"
              inputProps={{
                autoComplete: 'new-password',
              }}
              name="username"
              label="Email"
            />
          ) : (
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <PhoneNumber
                  value={field.value}
                  isError={!!errors?.username}
                  placeHolder="Enter phone number"
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          )}
        </Stack>

        <Stack spacing={1}>
          <RHFTextField
            size="small"
            name="password"
            label="Password"
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <Eye /> : <EyeSlash />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ pb: 2 }}>
            {!!watch('password').length ? <PasswordStrength password={watch('password')} /> : <Box height={18} />}
          </Box>
        </Stack>
      </Stack>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={!isValid}
      >
        Continue
      </LoadingButton>
    </FormProvider>
  );
}
