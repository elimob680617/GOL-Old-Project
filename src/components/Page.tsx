import Head from 'next/head';
import { forwardRef, ReactNode } from 'react';
// @mui
import { Box, BoxProps } from '@mui/material';
import { SIZES } from 'src/config';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  children: ReactNode;
  meta?: ReactNode;
  title: string;
}

const Page = forwardRef<HTMLDivElement, Props>(({ children, title = '', meta, ...other }, ref) => (
  <Box sx={{ bgcolor: 'background.neutral' }}>
    <Head>
      <title>{`${title} | Garden of love`}</title>
      {meta}
    </Head>

    <Box sx={{ maxWidth: SIZES.maxWidth, margin: '0 auto', minWidth: SIZES.maxWidth }} ref={ref} {...other}>
      {children}
    </Box>
  </Box>
));

export default Page;
