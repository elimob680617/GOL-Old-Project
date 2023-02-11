import { Box, Button, ClickAwayListener, Stack, styled } from '@mui/material';

import { useState } from 'react';

import { useSlateStatic } from 'slate-react';

import { removeLink } from './advancedFunctions';

import InsertLink from './InsertLinkElement';

const WrapperStyle = styled('div')(() => ({
  display: 'inline',

  position: 'relative',
}));

const PopupStyle = styled(Stack)(({ theme }) => ({
  position: 'absolute',

  left: 0,

  display: 'flex',

  backgroundColor: theme.palette.common.white,

  padding: theme.spacing(2, 1),

  borderRadius: theme.spacing(1),

  boxShadow: '0px 16px 32px rgba(53, 71, 82, 0.16)',

  zIndex: 2,
}));

const Link = ({ attributes, element, children, edit }) => {
  const editor = useSlateStatic();

  const [showEdit, setShowEdit] = useState<boolean>(false);

  const [showPalette, setShowPalette] = useState<boolean>(false);

  return (
    <WrapperStyle>
      <a
        className="editor-link"
        onClick={() => setShowPalette(true)}
        id={element.id}
        {...attributes}
        href={element.href}
      >
        {children}
      </a>

      {showPalette && !showEdit && (
        <ClickAwayListener onClickAway={() => setShowPalette(false)}>
          <PopupStyle spacing={4} alignItems="center" direction="row" contentEditable={false}>
            <a href={element.href} rel="noreferrer" target="_blank">
              {/* <FontAwesomeIcon icon={faExternalLinkAlt} /> */}

              {element.href}
            </a>

            <Stack direction="row">
              <Button variant="link" onClick={() => setShowEdit(true)}>
                {/* <FontAwesomeIcon icon={faUnlink} /> */}
                Edit
              </Button>

              <Button variant="link" onClick={() => removeLink(editor)}>
                {/* <FontAwesomeIcon icon={faUnlink} /> */}
                Remove
              </Button>
            </Stack>
          </PopupStyle>
        </ClickAwayListener>
      )}

      {showEdit && (
        <ClickAwayListener onClickAway={() => setShowEdit(false)}>
          <Box contentEditable={false} sx={{ position: 'absolute', left: 0, zIndex: 2 }}>
            <InsertLink
              link={element.href}
              insertLink={(link) => {
                edit(link, editor, element.id);

                setShowEdit(false);
              }}
            />
          </Box>
        </ClickAwayListener>
      )}
    </WrapperStyle>
  );
};

export default Link;
