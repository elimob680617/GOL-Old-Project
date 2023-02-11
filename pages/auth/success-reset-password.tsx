import React from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Container, Button, Typography } from '@mui/material';
// components
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
//next
import NextLink from 'next/link';
// routes
import { PATH_AUTH } from 'src/routes/paths';
import Image from 'next/image';

// image
import ImageSuccess from '/public/images/SuccessForgetPassword.png';
//...........................................................

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  // backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(3, 0),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  transform: 'translate(0, -50%)',
}));

export default function SuccessResetPassword() {
  return (
    <Page title={'Forget Password'}>
      <RootStyle>
        <Container maxWidth="sm">
          <HeaderStyle>
            <LogoStyle>
              <Logo sx={{ width: 94, height: 82 }} />
            </LogoStyle>
          </HeaderStyle>
          <ContentStyle>
            <Image src={ImageSuccess} alt="success" />
            <Stack alignItems="center" spacing={3}>
              <Typography variant="subtitle2" color="gray.700">
                Your Password has been reset successfully
              </Typography>
              <NextLink href={PATH_AUTH.signIn} passHref>
                <Button size="large" variant="contained" sx={{ mt: 5 }}>
                  Log into your account
                </Button>
              </NextLink>
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
