import { Card, Stack, Typography, useTheme, styled } from '@mui/material';
import React from 'react';
import { Icon } from 'src/components/Icon';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const ImageStyle = styled('img')(() => ({
  borderRadius: ' 8px 8px 0px 0px',
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#ffffff',
  },
}));

const UrgentCampaign = () => {
  const theme = useTheme();
  return (
    <Card sx={{ padding: theme.spacing(2) }}>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Icon name="Campaign" size="32" />
          <Typography variant="subtitle1">Urgent campaigns</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Icon name="left-arrow" color="error.main" />
          <Icon name="right-arrow-1" color="error.main" />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
        <Stack sx={{ backgroundColor: theme.palette.background.neutral, borderRadius: '8px' }}>
          <ImageStyle src="/fake-images/image 2.png" alt="" width="270px" height="202px" />
          <Stack sx={{ p: 1, mt: 1 }} spacing={2}>
            <Typography variant="subtitle1">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</Typography>
            <BorderLinearProgress variant="determinate" value={80} />
          </Stack>
        </Stack>
        <Stack sx={{ backgroundColor: theme.palette.background.neutral, borderRadius: '8px' }}>
          <ImageStyle src="/fake-images/image 3.png" alt="" width="270px" height="202px" />
          <Stack sx={{ p: 1, mt: 1 }} spacing={2}>
            <Typography variant="subtitle1">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</Typography>
            <BorderLinearProgress variant="determinate" value={80} />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default UrgentCampaign;
