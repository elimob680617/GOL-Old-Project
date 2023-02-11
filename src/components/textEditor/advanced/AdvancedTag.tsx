import { Typography } from '@mui/material';

const Tags = ({ attributes, children, element }: any) => (
  <Typography
    variant="subtitle1"
    color="primary.main"
    contentEditable={false}
    className="inserted-tag"
    id={element.id}
    {...element}
    sx={{
      verticalAlign: 'baseline',
      display: 'inline-block',
    }}
  >
    #{element.title}
    {children}
  </Typography>
);

export default Tags;
