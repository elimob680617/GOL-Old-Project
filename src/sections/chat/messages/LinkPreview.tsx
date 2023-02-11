import { FC } from 'react';
import { Stack, Typography, Avatar, styled, Link } from '@mui/material';

const OtherMsg = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1, 1, 1, 1),
  color: theme.palette.surface['onSurface'],
  width: 'max-content',
}));
const MyMsg = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.primary['light'],
  borderRadius: theme.spacing(1, 1, 1, 1),
  color: theme.palette.surface['onSurface'],
  width: 'max-content',
}));
const LinkAvatar = styled(Avatar)(({ theme }) => ({
  borderRadius: theme.spacing(1, 0, 0, 1),
}));

const LinkPreview: FC<{ imageUrl: string; title: string; caption: string; mine?: boolean; url: string }> = ({
  imageUrl,
  title,
  caption,
  mine = true,
  url,
}) => (
  <Link
    href={url.startsWith('http') ? url : `//${url}`}
    target="_blank"
    rel="noreferrer noopener"
    underline="none"
    component="a"
  >
    {mine ? (
      <MyMsg direction="row" spacing={2}>
        <LinkAvatar variant="square" alt="link" src={imageUrl} sx={{ width: 64, height: 64 }} />
        <Stack spacing={1}>
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="caption">{caption}</Typography>
        </Stack>
      </MyMsg>
    ) : (
      <OtherMsg direction="row" spacing={2}>
        <LinkAvatar variant="square" alt="link" src={imageUrl} sx={{ width: 64, height: 64 }} />
        <Stack spacing={1}>
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="caption">{caption}</Typography>
        </Stack>
      </OtherMsg>
    )}
  </Link>
);

export default LinkPreview;
