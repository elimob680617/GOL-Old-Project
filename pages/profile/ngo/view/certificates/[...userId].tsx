import { Box, Container } from '@mui/material';
import React from 'react';
import Layout from 'src/layouts';
import CertificateListView from 'src/sections/profile/components/CertificateListView';

export default function certificateView() {
  return (
    <Box sx={{ bgcolor: 'background.neutral' }}>
      <Container maxWidth="md" sx={{ height: '100vh', pt: 3 }}>
        <CertificateListView />
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

certificateView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------
