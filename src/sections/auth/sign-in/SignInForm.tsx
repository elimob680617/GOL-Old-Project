import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Alert, Box, IconButton, InputAdornment, Link, Stack } from '@mui/material';
import { Eye, EyeSlash } from 'iconsax-react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { analytics } from 'pages/_app';
import { useEffect, useState } from 'react';
// form
import { Controller, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import PhoneNumber from 'src/components/PhoneNumber';
import useAuth from 'src/hooks/useAuth';
import { signUpBySelector } from 'src/redux/slices/auth';
import { useSelector } from 'src/redux/store';
// routes
import { PATH_AUTH } from 'src/routes/paths';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

type SignInValuesProps = {
  username: string;
  password: string;
  afterSubmit?: string;
};

export default function SignUInFrom() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const userSignUpBy = useSelector(signUpBySelector);

  const LoginSchema = Yup.object().shape({
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
    username: '',
    password: '',
  };

  const methods = useForm<SignInValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
    mode: 'onBlur',
  });
  const {
    setValue,
    setError,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: SignInValuesProps) => {
    try {
      const { username, password } = data;
      const { fullName, id } = await login(username, password);
      analytics.identify(id, {
        fullName: fullName,
        Name: fullName,
        Email: username,
      });
      setTimeout(() => router.push('/home'), 1000);
    } catch (error: any) {
      setError('afterSubmit', {
        message: 'Incorrect username or password',
      });
    }
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
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <RHFCheckbox name="remember" label="Remember me" /> */}
        <Box />
        <NextLink href={PATH_AUTH.forgetPassword} passHref>
          <Link
            variant="caption"
            color="info.main"
            sx={{ mb: userSignUpBy === 'email' ? '' : 2, '&:hover': { textDecoration: 'none' } }}
          >
            Forgot password?
          </Link>
        </NextLink>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={!isValid}
      >
        {userSignUpBy === 'email' ? 'Sign in' : 'Continue'}
      </LoadingButton>
    </FormProvider>
  );
}
