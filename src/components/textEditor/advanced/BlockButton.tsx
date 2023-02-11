import { Button } from '@mui/material';
import { useSlate } from 'slate-react';
import { isBlockActive, TEXT_ALIGN_TYPES, toggleBlock } from './advancedFunctions';

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  const active = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type');
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
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

export default BlockButton;
