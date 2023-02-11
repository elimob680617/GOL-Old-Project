import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const RootStyle = styled(Stack)(({ theme }) => ({
  paddingTop: 1,
  backgroundColor: '#ffffff',
  borderRadius: theme.shape.borderRadius,
}));

function PostCard({ children }) {
  return <RootStyle sx={{ paddingTop: 2, backgroundColor: '#ffffff' }}>{children}</RootStyle>;
}

export default PostCard;
