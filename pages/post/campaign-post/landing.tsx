import { Box, Stack, styled } from '@mui/material';

import { ReactElement } from 'react';

import { SIZES } from 'src/config';

import Layout from 'src/layouts';

import CampaginLandingPage from 'src/sections/post/campaignPost/landing/CampaginLandingPage';

Create.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

const RootStyle = styled(Stack)(({ theme }) => ({
  maxWidth: SIZES.maxWidth,

  minWidth: SIZES.maxWidth,

  margin: '0 auto',

  position: 'relative',
}));

const WrapperStyle = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(3),

  minHeight: '100%',

  backgroundColor: theme.palette.background.neutral,

  height: 'calc(100vh - 64px)',
}));

export default function Create() {
  return (
    <WrapperStyle>
      <RootStyle spacing={4}>
        <CampaginLandingPage />
      </RootStyle>
    </WrapperStyle>
  );
}
