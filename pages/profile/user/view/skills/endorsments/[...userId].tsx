import { Box, Container } from '@mui/material';
import React from 'react';
import Layout from 'src/layouts';
import EndorsmentsView from 'src/sections/profile/user/view/EndorsmentsView';

export default function skillsView() {
  return (
    <Box sx={{ bgcolor: 'background.neutral' }}>
      <Container maxWidth="md" sx={{ height: '100vh', pt: 3 }}>
        <EndorsmentsView />
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

skillsView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------
