import { FC } from 'react';
import { styled, Typography, Link } from '@mui/material';
import ReactLinkify from 'react-linkify';

const OtherMsg = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(2, 2, 2, 0),
  padding: theme.spacing(1.625, 1.375),
  color: theme.palette.surface['onSurface'],
}));
const MyMsg = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.primary['light'],
  borderRadius: theme.spacing(2, 0, 2, 2),
  padding: theme.spacing(1.625, 1.375),
  color: theme.palette.surface['onSurface'],
}));

const componentDecorator = (href, text, key) => (
  <Link href={href} target="_blank" rel="noreferrer noopener" underline="none" component="a" key={key}>
    {text}
  </Link>
);

const Linkify: FC<{ text: string; mine?: boolean }> = ({ mine, text }) => (
  <ReactLinkify componentDecorator={componentDecorator}>
    {mine ? <MyMsg variant="body2">{text}</MyMsg> : <OtherMsg variant="body2">{text}</OtherMsg>}
  </ReactLinkify>
);

export default Linkify;
