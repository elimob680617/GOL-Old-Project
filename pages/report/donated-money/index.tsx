import { Box, Container, Stack } from '@mui/material';
import Layout from 'src/layouts';
import DonatedMoney from 'src/sections/reports/DonatedMoney';
// ----------------------------------------------------------------------

donatedMoney.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------

function donatedMoney() {
  return (
    <>
      <Box sx={{ width: '100%', bgcolor: 'background.neutral', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ p: '0px !important' }}>
          <Stack spacing={3} pb={3}>
            <DonatedMoney />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default donatedMoney;
