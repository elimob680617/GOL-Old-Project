//mui
import { Box, Container, Stack, Typography } from '@mui/material';
//next
import { useRouter } from 'next/router';
//icon
//components
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import Campaigns from './campaigns/Campaigns';
import Donors from './donors/Donors';
import Total from './total/Total';
//...
//.............................................................................
function ReportMain() {
  const router = useRouter();
  const { user } = useAuth();
  return (
    <Container maxWidth="lg" sx={{ p: '0px !important' }}>
      <Stack spacing={3} pb={3}>
        <Stack direction="row" spacing={3} px={4} py={2} sx={{ bgcolor: 'background.paper', borderRadius: 1, mt: 5 }}>
          <Box sx={{ cursor: 'pointer' }} onClick={() => router.back()}>
            <Icon name="left-arrow" color="grey.500" />
          </Box>
          <Typography variant="body1" color="text.primary">
            Financial Reports of NGO
          </Typography>
        </Stack>
        <Stack p={2} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          <Total id={user?.id} />
        </Stack>
        <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          <Campaigns id={user?.id} />
        </Stack>
        <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          <Donors id={user?.id} />
        </Stack>
      </Stack>
    </Container>
  );
}

export default ReportMain;
