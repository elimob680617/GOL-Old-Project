import { Skeleton, Stack } from '@mui/material';
import { FC } from 'react';

const PageSkelton: FC = () => (
  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Skeleton variant="circular" width={80} height={80} />
      <Stack spacing={1}>
        <Skeleton variant="rectangular" width={130} height={24} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rectangular" width={409} height={24} sx={{ borderRadius: 3 }} />
      </Stack>
    </Stack>

    <Skeleton variant="rectangular" width={112} height={32} sx={{ borderRadius: 4 }} />
  </Stack>
);

export default PageSkelton;
