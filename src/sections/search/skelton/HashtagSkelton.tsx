import { Skeleton, Stack } from '@mui/material';
import { FC } from 'react';

const HashtagSkelton: FC = () => (
  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Skeleton variant="circular" width={48} height={48} />
      <Skeleton variant="rectangular" width={130} height={20} sx={{ borderRadius: 3 }} />
    </Stack>

    <Skeleton variant="rectangular" width={112} height={32} sx={{ borderRadius: 4 }} />
  </Stack>
);

export default HashtagSkelton;
