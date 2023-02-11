import { Box, Container } from '@mui/material';
import React from 'react';
import Layout from 'src/layouts';
import ContactInfoView from 'src/sections/profile/components/ContactInfoView';

export default function contactInfosView() {
  return (
    <Box sx={{ bgcolor: 'background.neutral' }}>
      <Container maxWidth="md" sx={{ height: '100vh', pt: 3 }}>
        <ContactInfoView />
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

contactInfosView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------
