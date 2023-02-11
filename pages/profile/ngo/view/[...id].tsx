import { Box } from '@mui/material';
import React from 'react';
import Layout from 'src/layouts';
import NgoMainView from 'src/sections/profile/ngo/view/NgoMainView';

function profileView() {
  return (
    <Box sx={{ bgcolor: 'background.neutral' }}>
      <NgoMainView />
    </Box>
  );
}

// ----------------------------------------------------------------------

profileView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------
export default profileView;
