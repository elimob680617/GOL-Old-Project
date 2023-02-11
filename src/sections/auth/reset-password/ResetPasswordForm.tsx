import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Box, IconButton, InputAdornment, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { Eye, EyeSlash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import PasswordStrength from 'src/components/PasswordStrength';
import { useResetPasswordMutation } from 'src/_requests/graphql/cognito/mutations/resetPassword.generated';
import { useSelector } from 'src/redux/store';
import { resetUserPasswordSelector } from 'src/redux/slices/auth';
import { useRouter } from 'next/router';
import { PATH_AUTH } from 'src/routes/paths';

// ----------------------------------------------------------------------

type FormValuesProps = {
  password: string;
};

// type Props = {
//   onSent: VoidFunction;
//   onGetEmail: (value: string) => void;
// };

// export default function ResetPasswordForm({ onSent, onGetEmail }: Props) {
export default function ResetPasswordForm() {
  const router = useRouter();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const updateUserPassword = useSelector(resetUserPasswordSelector);

  const [restUserPassword] = useResetPasswordMutation();

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string().required('Password is required').min(8).max(50),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { password: '' },
    mode: 'onChange',
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;
  useEffect(() => {
    if (!updateUserPassword.username) {
      router.push(PATH_AUTH.forgetPassword);
    }
  }, [updateUserPassword.username, router]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      //Mutation!!
      const result = await restUserPassword({
        resetPasswordDto: {
          dto: {
            password: data.password,
            userName: updateUserPassword.username,
            confirmationCode: updateUserPassword.verificationCode,
          },
        },
      });
      if ((result as any)?.data?.resetPassword?.isSuccess) {
        router.push(PATH_AUTH.successResetPassword);
      }
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // if (isMountedRef.current) {
      //   // onSent();
      //   // onGetEmail(data.password);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <RHFTextField
          size="small"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="New password"
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
        <Box>
          {!!watch('password').length ? <PasswordStrength password={watch('password')} /> : <Box height={18} />}
        </Box>
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
      </Stack>
    </FormProvider>
  );
}
