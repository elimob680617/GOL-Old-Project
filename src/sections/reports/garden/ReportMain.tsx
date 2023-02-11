import React from 'react';
//mui
import { Container, Stack, Typography, Box } from '@mui/material';
//next
import Image from 'next/image';
import { useRouter } from 'next/router';
//icon
import { Icon } from 'src/components/Icon';
//components
import Campaigns from './campaigns/Campaigns';
import Donors from './donors/Donors';
import Total from './total/Total';

//...
//.............................................................................
function ReportMain() {
  const router = useRouter();
  return (
    <Container maxWidth="lg" sx={{ p: '0px !important' }}>
      <Stack spacing={3} pb={3}>
        <Stack direction="row" spacing={3} px={4} py={2} sx={{ bgcolor: 'background.paper', borderRadius: 1, mt: 5 }}>
          <Box sx={{ cursor: 'pointer' }} onClick={() => router.back()}>
            <Icon name="left-arrow" color="grey.500" />
          </Box>
          <Typography variant="body1" color="text.primary">
            Application Report of Garden of Love
          </Typography>
        </Stack>
        <Stack p={2} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          <Total />
        </Stack>
        <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          <Campaigns />
        </Stack>
        <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          <Donors />
        </Stack>
      </Stack>
    </Container>
  );
}

export default ReportMain;
