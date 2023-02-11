import { Box, IconButton, Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';

const ImageStyle = styled('img')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}));

const WrapperStyle = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  height: '140px',
  overflow: 'hidden',
}));

const Ads: FC = () => (
  <WrapperStyle>
    <ImageStyle src="/fake-images/image 1.png" />
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="caption" sx={{ fontWeight: '400', fontSize: '12px', lineHeight: '15px', color: '#ffffff' }}>
        Ads
      </Typography>
      <Stack direction="row">
        <IconButton>
          <img width={12} height={12} src="/icons/surprice.svg" alt="report-ads" />
        </IconButton>
        <IconButton>
          <img width={12} height={12} src="/icons/Close/24/Outline-white.svg" alt="report-ads" />
        </IconButton>
      </Stack>
    </Stack>
  </WrapperStyle>
);

export default Ads;
