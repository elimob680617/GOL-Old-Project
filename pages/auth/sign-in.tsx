// next
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Container, Typography, Link } from '@mui/material';
// routes
import { PATH_AUTH } from 'src/routes/paths';
// guards
import GuestGuard from 'src/guards/GuestGuard';
// components
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
// sections
import { SignInForm } from 'src/sections/auth';
// icons
//redux
import { useSelector, useDispatch } from 'src/redux/store';
import { signUpBy, signUpBySelector } from 'src/redux/slices/auth';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  // backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(3, 0),
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  lineHeight: 0,
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center !important',
  justifyContent: 'start',
  padding: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(3, 8),
  },
}));

const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 416,
  margin: 'auto',
  padding: theme.spacing(3.4),
}));

const JoinSectionStyle = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(2),
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
}));
const LoginSectionStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
}));
const LogoStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '42%',
  transform: 'translate(0, -50%)',
}));
const ImageStyle = styled(Image)(({ theme }) => ({
  cursor: 'pointer',
}));
// ----------------------------------------------------------------------
export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userSignUpBy = useSelector(signUpBySelector);

  const handleSignUpBy = () => {
    dispatch(signUpBy({ signUpBy: userSignUpBy === 'email' ? 'phoneNumber' : 'email' }));
  };
  return (
    <GuestGuard>
      <Page title="Sign In">
        <RootStyle>
          <Container maxWidth="sm">
            <HeaderStyle>
              <LogoStyle>
                <Logo sx={{ width: 94, height: 82 }} />
              </LogoStyle>
            </HeaderStyle>
            <ContentStyle>
              <Stack alignItems="center" spacing={2}>
                <Typography variant="h4" color="text.primary">
                  Sign In
                </Typography>
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  Love is the fragrance of god. If you can smell the fragrance, come in to the Garden Of Love
                </Typography>
              </Stack>
              <SignInForm />
              {/* {userSignUpBy === 'email' ? (
                <Stack direction="row" alignItems="center" mt={3} mb={3}>
                  <Divider sx={{ flexGrow: 1 }} />
                  <Typography sx={{ px: 2 }} variant="subtitle2" color="gray.900">
                    Or
                  </Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                </Stack>
              ) : (
                ''
              )}

              {userSignUpBy === 'phoneNumber' ? '' : <SocialSingInButtons />} */}
            </ContentStyle>
            <JoinSectionStyle direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                New to Gardenoflove?
              </Typography>
              <NextLink href={PATH_AUTH.signUp.basicInfo} passHref>
                <Link variant="body1" color="primary.main" sx={{ textDecoration: 'none !important' }}>
                  Join Now
                </Link>
              </NextLink>
            </JoinSectionStyle>
            <LoginSectionStyle direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Using {userSignUpBy === 'email' ? 'phone number' : 'email address'}?
              </Typography>
              <Typography onClick={handleSignUpBy} variant="body1" color="primary.main" sx={{ cursor: 'pointer' }}>
                Sign in by {userSignUpBy === 'email' ? 'Phone Number' : 'Email Address'}
              </Typography>
            </LoginSectionStyle>
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}
