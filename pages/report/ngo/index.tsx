import { Box, Container, Stack } from '@mui/material';
import React from 'react';
// layouts
import Layout from 'src/layouts';
import ReportMain from 'src/sections/reports/ngo/ReportMain';
//......................................................
ReportMainPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};
//.....................................................
function ReportMainPage() {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.neutral', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ p: '0px !important' }}>
        <Stack spacing={3} pb={3}>
          <ReportMain />
        </Stack>
      </Container>
    </Box>
  );
}

export default ReportMainPage;
