import React from 'react';
//mui
import { Stack, Typography } from '@mui/material';
//next
import Image from 'next/image';
//icon
import NoData from 'public/icons/noData.png';
//...
//............................................................

function NoResult() {
  return (
    <Stack alignItems="center" justifyContent="center">
      <Image src={NoData} alt="noData" />
      <Typography variant="body2" color="text.secondary">
        No Data Found
      </Typography>
    </Stack>
  );
}

export default NoResult;
