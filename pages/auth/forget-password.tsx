import React from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Container, Typography } from '@mui/material';
// components
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
// sections
import ForgetPasswordForm from 'src/sections/auth/forget-password/ForgetPasswordForm';
//next
import { useRouter } from 'next/router';
import Image from 'next/image';

// icons
import ArrowLeft from '/public/icons/account/ArrowLeft.svg';
//...........................................................

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
  padding: theme.spacing(4),
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
export default function ForgetPassword() {
  const router = useRouter();

  return (
    <Page title={'Forget Password'}>
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
            <Stack alignItems="center" spacing={2}>
              <Typography variant="h4" color="text.primary">
                Forget Password
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Recover your password by entering your email address.
              </Typography>
            </Stack>
            <Box mt={3} />
            <ForgetPasswordForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
