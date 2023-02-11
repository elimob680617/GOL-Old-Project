// next
import Image from 'next/image';
import { useRouter } from 'next/router';

// @mui
import { styled } from '@mui/material/styles';
import { Card, Box, Stack, Container, Typography } from '@mui/material';
// routes

// layouts
// components
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';

// sections
import { ResetPasswordForm } from 'src/sections/auth';
// assets
// icons
import ArrowLeft from '/public/icons/account/ArrowLeft.svg';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  // backgroundColor: theme.palette.grey[200],
  display: 'flex',
  alignItems: 'center',
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
  maxWidth: 360,
  margin: 'auto',
  padding: theme.spacing(3),
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

// ----------------------------------------------------------------------

export default function ResetPassword() {
  // const [email, setEmail] = useState('');
  // const [sent, setSent] = useState(false);
  const router = useRouter();

  return (
    <Page title="Reset Password">
      <RootStyle>
        <Container>
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
              {/* {!sent ? (
                <> */}
              <Stack spacing={1} alignItems="center" mb={3}>
                <Typography variant="h4" paragraph color="text.primary" sx={{ margin: 0 }}>
                  Reset password
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Choose new password.
                </Typography>
              </Stack>

              <ResetPasswordForm
              // onSent={() => setSent(true)}
              // onGetEmail={(value) => setEmail(value)}
              />
              {/* </>
              ) : (
                <Stack textAlign="center">
                  <SentIcon sx={{ mb: 5, mx: 'auto', height: 160 }} />
                  <Typography variant="h3" gutterBottom>
                    Request sent successfully
                  </Typography>
                  <Typography>
                    We have sent a confirmation email to &nbsp;
                    <strong>{email}</strong>
                    <br />
                    Please check your email.
                  </Typography>
                </Stack>
              )} */}
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
