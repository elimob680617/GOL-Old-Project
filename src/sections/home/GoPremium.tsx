import { Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';

const WrapperStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: 16,
  padding: theme.spacing(1.5),
}));

const GoPremium: FC = () => (
  <WrapperStyle spacing={2} alignItems="center" direction="row">
    <img src="/icons/premium.svg" width={58} height={58} alt="premium" />
    <Stack spacing={1}>
      <Typography sx={{ fontWeight: 500, fontSize: '16px', lineHeight: '20px', color: '#ffffff' }}>
        Premium for free?
      </Typography>
      <Typography sx={{ fontWeight: 400, fontSize: '12px', lineHeight: '15px', color: '#ffffff' }}>
        Description goes here
      </Typography>
    </Stack>
  </WrapperStyle>
);

export default GoPremium;
