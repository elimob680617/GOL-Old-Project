import { Box, Container } from '@mui/material';
import React from 'react';
import Layout from 'src/layouts';
import ProjectListView from 'src/sections/profile/ngo/view/ProjectListView';

export default function experiencesView() {
  return (
    <Box sx={{ bgcolor: 'background.neutral' }}>
      <Container maxWidth="md" sx={{ height: 'fit-content', pt: 3 }}>
        <ProjectListView />
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

experiencesView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------
