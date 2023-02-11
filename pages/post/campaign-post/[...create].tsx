import { Box, Stack, styled } from '@mui/material';
import { ReactElement } from 'react';
import { SIZES } from 'src/config';
import Layout from 'src/layouts';
import CreateCampaignPost from 'src/sections/post/campaignPost/careateCampaignPost/CreateCampaignPost';

Create.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

const RootStyle = styled(Stack)(({ theme }) => ({
  maxWidth: SIZES.maxWidth,
  minWidth: SIZES.maxWidth,
  margin: '0 auto',
  minHeight: 'calc(100vh - 112px)',
  position: 'relative',
}));

const WrapperStyle = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  backgroundColor: theme.palette.background.neutral,
  minHeight: '100%',
}));

export default function Create() {
  return (
    <WrapperStyle>
      <RootStyle spacing={4}>
        <Stack spacing={3} sx={{ backgroundColor: 'common.white', p: 3, borderRadius: 1 }}>
          <CreateCampaignPost />
        </Stack>
      </RootStyle>
    </WrapperStyle>
  );
}
