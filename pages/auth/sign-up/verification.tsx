// next
import Image from 'next/image';
import { useRouter } from 'next/router';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Container, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from 'src/routes/paths';
// guards
import GuestGuard from 'src/guards/GuestGuard';
// components
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
// sections
import { useSelector } from 'src/redux/store';
import { signUpUserTypeSelector } from 'src/redux/slices/auth';
import { VerifyRegistration } from 'src/sections/auth';
// icons
import ArrowLeft from '/public/icons/account/ArrowLeft.svg';
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
  margin: 'auto',
  padding: theme.spacing(3.4),
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
// ----------------------------------------------------------------------

export default function Verification() {
  const router = useRouter();

  const userType = useSelector(signUpUserTypeSelector);

  if (!userType) {
    router.push(PATH_AUTH.signUp.typeSelection);
    return null;
  }

  function secureUsername(username: string) {
    return username;
  }

  // send Code first mounting the component

  return (
    <GuestGuard>
      <Page title="Sign In">
        <RootStyle>
          <Container maxWidth="sm">
            <HeaderStyle>
              <Box px={2}>
                <ImageStyle src={ArrowLeft} alt="back" onClick={() => router.back()} />
              </Box>
              <LogoStyle>
                <Logo sx={{ width: 94, height: 82 }} />
              </LogoStyle>
            </HeaderStyle>
            <ContentStyle>
              <Stack alignItems="center">
                <Typography variant="h4" color="text.primary">
                  Is it Really you?
                </Typography>
              </Stack>
              <Box mt={3} />
              <VerifyRegistration />
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}
