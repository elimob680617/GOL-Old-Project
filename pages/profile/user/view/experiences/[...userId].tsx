import { Box, Container } from '@mui/material';
import React from 'react';
import Layout from 'src/layouts';
import ExperienceListView from 'src/sections/profile/user/view/ExperienceListView';

export default function experiencesView() {
  return (
    <Box sx={{ bgcolor: 'background.neutral' }}>
      <Container maxWidth="md" sx={{ height: '100vh', pt: 3 }}>
        <ExperienceListView />
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

experiencesView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------
