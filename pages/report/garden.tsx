import { Stack } from '@mui/material';
import React from 'react';
// layouts
import Layout from 'src/layouts';
import ReportMain from 'src/sections/reports/garden/ReportMain';
//......................................................
ReportMainPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};
//.....................................................
function ReportMainPage() {
  return (
    <Stack sx={{ bgcolor: 'background.neutral' }}>
      <ReportMain />
    </Stack>
  );
}

export default ReportMainPage;
