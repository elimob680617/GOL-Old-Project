import { Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { useRouter } from 'next/router';

const TextStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '15px',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  marginRight: theme.spacing(2),
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const Helpers: FC = () => {
  const router = useRouter();
  return (
    <Stack flexWrap="wrap" direction="row">
      <TextStyle variant="caption">Languages</TextStyle>
      <TextStyle variant="caption">About</TextStyle>
      <TextStyle variant="caption" onClick={() => router.push('help/help-center')}>
        Help Center
      </TextStyle>
      <TextStyle variant="caption">Privacy Policy</TextStyle>
      <TextStyle variant="caption">legal</TextStyle>
      <TextStyle variant="caption">Terms of Service</TextStyle>
      <TextStyle variant="caption">Cookies</TextStyle>
      <TextStyle variant="caption">Whitepaper</TextStyle>
      <TextStyle variant="caption">Contact GOL</TextStyle>
    </Stack>
  );
};

export default Helpers;
