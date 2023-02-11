import { Card, Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';
import UserRowWithExplain from 'src/components/UserRowWithExplain';

const TitleStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 14,
  color: theme.palette.text.primary,
}));

const MyConnectionsDonors: FC = () => (
  <Card sx={{ padding: 2, width: 264 }}>
    <Stack spacing={2}>
      <Stack sx={{ cursor: 'pointer' }} direction="row" justifyContent="space-between">
        <TitleStyle variant="subtitle2">My connections donors</TitleStyle>
        <img src="/icons/right arrow/24/Outline.svg" width={20} height={20} alt="connection-arrow" />
      </Stack>

      <UserRowWithExplain
        avatar="https://img.favpng.com/15/23/14/eye-art-monkey-d-luffy-cheek-brown-hair-png-favpng-kRnt07jjpY7RR9YbMR3AcTjUS.jpg"
        fullname="Mohsen Najafi"
        explainText="120.26 GARD"
      />
      <UserRowWithExplain
        avatar="https://i.kym-cdn.com/photos/images/newsfeed/001/309/966/b86.png"
        fullname="Tanin Rezaei"
        explainText="120.26 GARD"
      />
      <UserRowWithExplain
        avatar="https://img.joomcdn.net/1137ca63d42ca42e71f8a52e0bb5a291b46993bb_original.jpeg"
        fullname="Mehrnaz Javadi"
        explainText="120.26 GARD"
      />
    </Stack>
  </Card>
);

export default MyConnectionsDonors;
