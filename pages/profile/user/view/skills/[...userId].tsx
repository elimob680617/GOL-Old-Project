import { Box, Container } from '@mui/material';
import React from 'react';
import Layout from 'src/layouts';
import SkillListView from 'src/sections/profile/user/view/SkillListView';

export default function skillsView() {
  return (
    <Box sx={{ bgcolor: 'background.neutral' }}>
      <Container maxWidth="md" sx={{ height: '100vh', pt: 3 }}>
        <SkillListView />
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

skillsView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------
