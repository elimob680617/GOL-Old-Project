import { Button } from '@mui/material';
import { useSlate } from 'slate-react';
import { isMarkActive, toggleMark } from './advancedFunctions';

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  const active = isMarkActive(editor, format);

  return (
    <Button
      sx={{
        borderColor: '#ffffff!important',
        ...(active && {
          backgroundColor: (theme) => theme.palette.secondary.light,
        }),
      }}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

export default MarkButton;
