// next
import NextLink from 'next/link';
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
import { UserTypeSelection } from 'src/sections/auth';
import { useDispatch, useSelector } from 'src/redux/store';
import { signUpBy, signUpBySelector } from 'src/redux/slices/auth';
import Image from 'next/image';
// icons
import ArrowLeft from '/public/icons/account/ArrowLeft.svg';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  // backgroundColor: theme.palette.grey[200],
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const HeaderStyle = styled(Box)(({ theme }) => ({
  lineHeight: 0,
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center !important',
  justifyContent: 'start',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(3, 8),
  },
}));

const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 416,
  backgroundColor: theme.palette.background.paper,
  margin: 'auto',
  padding: theme.spacing(3, 4),
}));

const JoinSectionStyle = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1, 0),
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundColor: theme.palette.grey[200],
  borderRadius: theme.spacing(1),
}));
const SignPhoneNumberStyle = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
}));

const LogoStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '42%',
  top: '50%',
  transform: 'translate(0, -50%)',
}));
const ImageStyle = styled(Image)(({ theme }) => ({
  cursor: 'pointer',
}));
export default function TypeSelection() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userSignUpBy = useSelector(signUpBySelector);

  const handleSignUpBy = () => {
    dispatch(signUpBy({ signUpBy: userSignUpBy === 'email' ? 'phoneNumber' : 'email' }));
  };

  return (
    <GuestGuard>
      <Page title="User Type Selection">
        <RootStyle>
          <Container maxWidth="sm">
            <HeaderStyle>
              <Box px={2}>
                <ImageStyle src={ArrowLeft} alt="back" onClick={() => router.push(PATH_AUTH.signIn)} />
              </Box>
              <LogoStyle>
                <Logo sx={{ width: 94, height: 82 }} />
              </LogoStyle>
            </HeaderStyle>
            <ContentStyle>
              <Stack alignItems="center">
                <Typography variant="h4" color="gray.700">
                  Sign Up
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Select your user type first
                </Typography>
              </Stack>

              <UserTypeSelection />
            </ContentStyle>
            <JoinSectionStyle direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
              <NextLink href={PATH_AUTH.signIn} passHref>
                <Link variant="body2" color="primary.main" sx={{ textDecoration: 'none' }}>
                  Sing In
                </Link>
              </NextLink>
            </JoinSectionStyle>
            <SignPhoneNumberStyle direction="row" spacing={1}>
              <Typography variant="body1" color="text.secondary">
                Using {userSignUpBy === 'email' ? 'Phone number' : 'Email'}?
              </Typography>
              <Typography onClick={handleSignUpBy} variant="body2" color="primary.main" sx={{ textDecoration: 'none' }}>
                Sign up by {userSignUpBy === 'email' ? 'Phone number' : 'Email'}
              </Typography>
            </SignPhoneNumberStyle>
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}
