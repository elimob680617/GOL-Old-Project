import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Alert, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { basicInfoSelector, normalUserInfoSelector, normalUsreInfoUpdated } from 'src/redux/slices/auth';
import { useDispatch, useSelector } from 'src/redux/store';
import { useRegisterMutation } from 'src/_requests/graphql/cognito/mutations/regsiter.generated';
import * as Yup from 'yup';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// routes
import { PATH_AUTH } from '../../../routes/paths';

// ----------------------------------------------------------------------

type NormalUserInfoFormProps = {
  firstName: string;
  lastName: string;
  afterSubmit?: string;
};

const PolicySectionStyle = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1.5, 0),
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
}));

export default function NormalUserInfoForm() {
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();

  const [registerUser] = useRegisterMutation();

  const { firstName, lastName } = useSelector(normalUserInfoSelector);

  const { username } = useSelector(basicInfoSelector);

  const router = useRouter();

  const LoginSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
  });

  const defaultValues = {
    firstName,
    lastName,
  };

  const methods = useForm<NormalUserInfoFormProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: NormalUserInfoFormProps) => {
    const { firstName, lastName } = data;
    try {
      dispatch(normalUsreInfoUpdated(data));
      await registerUser({
        registerReqDto: { dto: { firstName, lastName, fullName: firstName + ' ' + lastName, userName: username } },
      });

      // FIXME: error handling

      router.push(PATH_AUTH.signUp.verification);
    } catch (error: any) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack mt={3} spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack spacing={1}>
          <RHFTextField size="small" name="firstName" label="First Name" />
        </Stack>

        <Stack spacing={1}>
          <RHFTextField size="small" name="lastName" label="Last Name" type="text" />
        </Stack>
      </Stack>

      <PolicySectionStyle>
        <Typography variant="caption" color="text.secondary" textAlign="center">
          By clicking Agree & Join, you agree to the Gardenoflove{' '}
          <NextLink href={PATH_AUTH.signIn} passHref>
            <Link variant="caption" component="span" color="primary.light" sx={{ textDecoration: 'none' }}>
              User Agreement
            </Link>
          </NextLink>
          ,&nbsp;
          <NextLink href={PATH_AUTH.signIn} passHref>
            <Link variant="caption" component="span" color="primary.light" sx={{ textDecoration: 'none' }}>
              Privacy Policy
            </Link>
          </NextLink>
          , and&nbsp;
          <NextLink href={PATH_AUTH.signIn} passHref>
            <Link variant="caption" component="span" color="primary.light" sx={{ textDecoration: 'none' }}>
              Cookie Policy.
            </Link>
          </NextLink>
        </Typography>
      </PolicySectionStyle>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={!isValid}
      >
        Agree & join
      </LoadingButton>
    </FormProvider>
  );
}
