import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Alert, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { basicInfoSelector, ngoCompanyUserInfoSelector, NGOCompanyUserInfoUpdated } from 'src/redux/slices/auth';
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

type NGOCompanyInfoFormProps = {
  fullName: string;
  afterSubmit?: string;
};

const PolicySectionStyle = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(3),
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 0),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.grey[100],
}));

export default function NGOCompanyInfoForm() {
  const isMountedRef = useIsMountedRef();

  const dispatch = useDispatch();

  const { fullName } = useSelector(ngoCompanyUserInfoSelector);
  const [registerUser] = useRegisterMutation();

  const { username } = useSelector(basicInfoSelector);

  const router = useRouter();

  const NGOCompanyInfoSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
  });

  const defaultValues = {
    fullName,
  };

  const methods = useForm<NGOCompanyInfoFormProps>({
    resolver: yupResolver(NGOCompanyInfoSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: NGOCompanyInfoFormProps) => {
    const { fullName } = data;
    try {
      dispatch(NGOCompanyUserInfoUpdated(data));
      await registerUser({ registerReqDto: { dto: { firstName: '', lastName: '', fullName, userName: username } } });

      // FIXME: error handling

      router.push(PATH_AUTH.signUp.verification);
    } catch (error: any) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }

    try {
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
          <RHFTextField size="small" name="fullName" label="Full name" />
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
