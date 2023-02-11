import { Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import React from 'react';
import { Editor, Element as SlateElement } from 'slate';
import { useSlate } from 'slate-react';
import HeadingBlockButton from './HeadingBlockButton';

const blocks = [
  { format: 'paragraph', text: 'Normal' },
  { format: 'heading-one', text: 'Heading 1' },
  { format: 'heading-two', text: 'Heading 2' },
];

const getBlockFormat = (editor, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;
  let type = 'Normal';

  blocks.forEach((block) => {
    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === block.format,
      })
    );
    if (!!match) {
      type = block.text;
    }
  });
  return type;
};

const Heading = () => {
  const editor = useSlate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ backgroundColor: 'grey.100' }}
      >
        <Stack spacing={2} direction="row">
          <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
            {getBlockFormat(editor) || 'Normal'}
          </Typography>

          <img width={17} src="/icons/arrow/arrow-down.svg" alt="" />
        </Stack>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <HeadingBlockButton format="paragraph" title={'normal'} />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <HeadingBlockButton format="heading-one" title={'Heading 1'} />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <HeadingBlockButton format="heading-two" title={'Heading 2'} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default Heading;
