import { Stack, Typography } from '@mui/material';
import { FC } from 'react';
import Image from 'next/image';

const HashtagNotFound: FC = () => (
  <Stack alignItems="center" spacing={3}>
    <Image src="/images/notfound/hashtagNotFound.svg" width={100} height={100} alt="fundrasing-not-found" />
    <Typography variant="body2" color="text.secondary">
      No Data Found
    </Typography>
  </Stack>
);

export default HashtagNotFound;
