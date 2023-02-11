import { Box, Container, Stack } from '@mui/material';
import React from 'react';
import Layout from 'src/layouts';
import GoPremium from 'src/sections/home/GoPremium';
import Helpers from 'src/sections/home/Helpers';
import MyConnectionsDonors from 'src/sections/home/MyConnectionsDonors';
import NotifSection from 'src/sections/notification';
import { styled } from '@mui/material/styles';
// ----------------------------------------------------------------------
Notification.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};
const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  paddingTop: theme.spacing(3),
}));
// ----------------------------------------------------------------------
function Notification() {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.neutral', minHeight: 'calc(100vh - 64px)' }}>
      <Container sx={{ p: { md: 0 } }}>
        <RootStyle>
          <Stack spacing={7.5} direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={4} sx={{ width: 264 }}>
              <GoPremium />
              <Helpers />
            </Stack>
            <NotifSection />
            <Stack spacing={1.5} sx={{ width: 264 }}>
              <MyConnectionsDonors />
            </Stack>
          </Stack>
        </RootStyle>
      </Container>
    </Box>
  );
}

export default Notification;
