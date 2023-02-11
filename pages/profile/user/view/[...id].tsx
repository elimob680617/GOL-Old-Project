import { Box } from '@mui/material';
import React from 'react';
import Layout from 'src/layouts';
import UserMainView from 'src/sections/profile/user/view/UserMainView';

function profileView() {
  return (
    <Box sx={{ bgcolor: 'background.neutral' }}>
      <UserMainView />
    </Box>
  );
}

// ----------------------------------------------------------------------

profileView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------
export default profileView;
