import { styled } from '@mui/material';

const PreStyle = styled('pre')(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  fontWeight: 300,
  fontSize: '16px',
  lineHeight: '20px',
  whiteSpace: 'pre-wrap',
  borderRadius: theme.spacing(1),
}));

const SnippetElement = ({ children, id, attributes }) => (
  <PreStyle {...attributes} id={id}>
    {children}
  </PreStyle>
);

export default SnippetElement;
