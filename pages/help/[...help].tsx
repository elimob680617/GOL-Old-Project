import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
// Help Center Routes
import helpRoutes from 'src/sections/help/helpRoutes';
import { Box } from '@mui/material';

const pageSector: Record<string, ReactNode | null> = {
  user: null,
  ...helpRoutes,
};

function Help() {
  const { query } = useRouter();
  return <Box sx={{ bgcolor: 'background.neutral' }}>{pageSector[query.help as string]}</Box>;
}

// ----------------------------------------------------------------------

// Help.getLayout = function getLayout(page: React.ReactElement) {
//   return <Layout variant="simple">{page}</Layout>;
// };

// ----------------------------------------------------------------------

export default Help;
