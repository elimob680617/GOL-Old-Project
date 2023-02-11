import React, { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Container, Typography } from '@mui/material';
// components
import Logo from 'src/components/Logo';
//next
// routes
import Image from 'next/image';

// image
import ImageSuccess from '/public/images/SuccessSignUp.png';
import useAuth from 'src/hooks/useAuth';
import { useSelector } from 'src/redux/store';
import { basicInfoSelector } from 'src/redux/slices/auth';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
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
  top: '50%',
  transform: 'translate(0, -50%)',
}));
export default function SuccessSignUp() {
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const router = useRouter();
  const { username, password } = useSelector(basicInfoSelector);

  const handleLogin = async () => {
    setLoading(true);
    await login(username, password);
    if (!user?.completeQar) router.push('/welcome');
  };

  return (
    <RootStyle>
      <Container maxWidth="sm">
        <HeaderStyle>
          <LogoStyle>
            <Logo sx={{ width: 94, height: 82 }} />
          </LogoStyle>
        </HeaderStyle>
        <ContentStyle>
          <Image src={ImageSuccess} alt="success" />
          <Stack alignItems="center" spacing={3} sx={{ px: 4 }}>
            <Typography variant="subtitle2" color="gray.700" textAlign="center">
              Your account has been created successfully.
            </Typography>
            <LoadingButton loading={loading} size="large" variant="contained" onClick={handleLogin}>
              <Typography variant="button" color="Background.paper.">
                Start exploring
              </Typography>
            </LoadingButton>
          </Stack>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
