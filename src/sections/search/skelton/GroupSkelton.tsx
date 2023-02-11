import { Skeleton, Stack, styled } from '@mui/material';
import { FC } from 'react';

const SkeletonStyle = styled(Skeleton)(({ theme }) => ({
  marginLeft: theme.spacing(-1),
  borderRadius: theme.spacing(4),
}));

const GroupSkelton: FC = () => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <Skeleton variant="rectangular" sx={{ borderRadius: 3 }} width={80} height={80} />

    <Stack spacing={1}>
      <Skeleton sx={{ borderRadius: 3 }} variant="rectangular" width={130} height={20} />
      <Skeleton variant="rectangular" width={78} height={20} sx={{ borderRadius: 3 }} />
      <Stack direction="row">
        <SkeletonStyle variant="circular" width={24} height={24} sx={{ marginLeft: 0 }} />
        <SkeletonStyle variant="circular" width={24} height={24} />
        <SkeletonStyle variant="circular" width={24} height={24} />
      </Stack>
    </Stack>
  </Stack>
);

export default GroupSkelton;
