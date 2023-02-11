import { Box, Button, Stack, styled, Typography } from '@mui/material';
import React from 'react';
import GoPremium from '../../home/GoPremium';
import Helpers from '../../home/Helpers';
import PageNotFound from '../notFound/PageNotFound';
import PageSkelton from '../skelton/PageSkelton';
import PageItem from './PageItem';

import reload from '/public/icons/search/reload.svg';

const ReloadButtonStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}));

function PageSearch() {
  return (
    <Stack spacing={3} direction="row" sx={{ flex: 1 }}>
      <Stack spacing={4} sx={{ width: 264 }}>
        <GoPremium />
        <Helpers />
      </Stack>
      <Stack
        spacing={2}
        sx={{ backgroundColor: ({ palette }) => palette.background.paper, borderRadius: 1, flex: 1, px: 3, py: 2 }}
      >
        <PageItem />
        <PageItem />
        <PageItem />
        <PageItem />

        <PageSkelton />

        <PageSkelton />

        <PageSkelton />
        <PageSkelton />

        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <PageNotFound />
        </Stack>

        <ReloadButtonStyle>
          <Button variant="outlined" endIcon={<img src={reload} alt={reload} />} sx={{ mt: 1 }}>
            <Typography color="gray.900">See More</Typography>
          </Button>
        </ReloadButtonStyle>
      </Stack>
    </Stack>
  );
}

export default PageSearch;
