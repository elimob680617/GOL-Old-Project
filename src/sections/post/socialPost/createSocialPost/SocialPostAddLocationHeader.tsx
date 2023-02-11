import { IconButton, Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { useRouter } from 'next/router';

const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));

const SocialPostAddLocationHeader: FC = () => {
  const { back } = useRouter();

  return (
    <HeaderWrapperStyle spacing={2} direction="row" alignItems="center">
      <IconButton onClick={() => back()} sx={{ padding: 0 }}>
        <img src="/icons/arrow/left-arrow.svg" width={24} height={24} alt="" />
      </IconButton>
      <Typography
        variant="subtitle1"
        sx={{
          color: 'grey.900',
          fontWeight: 500,
        }}
      >
        Search your location
      </Typography>
    </HeaderWrapperStyle>
  );
};

export default SocialPostAddLocationHeader;
