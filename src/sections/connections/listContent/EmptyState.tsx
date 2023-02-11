import { Box, Divider, Stack, Typography } from '@mui/material';
import React from 'react';

export default function EmptyState() {
  return (
    <>
      <Divider />
      <Stack pt={3} pb={10} sx={{ justifyContent: 'center', alignItems: 'center' }} spacing={4}>
        <img src="/images/Group 302.svg" alt="Empty state" />
        <Box>
          <Typography variant="body2" color="text.secondary">
            No Data Found
          </Typography>
        </Box>
      </Stack>
    </>
  );
}
