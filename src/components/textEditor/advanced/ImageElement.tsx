import { Box, Button, ClickAwayListener, IconButton, Stack, styled, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Transforms } from 'slate';
import { useFocused, useSelected, useSlate } from 'slate-react';

interface IIconButtonStyle {
  active: boolean;
}

const IconButtonStyle = styled(IconButton)<IIconButtonStyle>(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : 'rgba(244, 247, 251, 0.5)',
  height: 'fit-content',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const ImageElement = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  const [showPostionsOptions, setShowPostionsOptions] = useState<boolean>(false);
  const editor = useSlate();
  const { width, float, alt, href } = element;
  const editorValue = editor.children as any[];
  const [showAlt, setShowAlt] = useState<boolean>(false);
  const [showHref, setShowHref] = useState<boolean>(false);
  const [altValue, setAltValue] = useState<string>(alt || '');
  const selectedAltValue = useRef<string>(alt);
  const [hrefValue, setHrefValue] = useState<string>(href || '');

  const findImageLocation = () => {
    const index = editorValue.findIndex((i) => i.id === element.id);
    return index;
  };

  const needInsertNewNode = (index: number) => {
    if (editorValue[index + 1]) {
      return;
    }
    Transforms.insertNodes(
      editor,
      {
        type: 'paragraph',
        children: [
          {
            text: '',
          },
        ],
      } as any,
      { at: [index + 1] }
    );
  };

  const changeFloat = (float: 'right' | 'left') => {
    const index = findImageLocation();
    Transforms.setNodes(
      editor,
      {
        type: 'image',
        url: element.url,
        children: [
          {
            text: '',
          },
        ],
        id: element.id,
        float,
        width: 'w-50',
        alt: selectedAltValue.current,
        href: hrefValue,
      },
      { at: [index] }
    );
    needInsertNewNode(index);
  };

  const changeWidth = (width: 'w-100' | 'w-50' | 'w-150') => {
    const index = findImageLocation();
    Transforms.setNodes(
      editor,
      {
        type: 'image',
        url: element.url,
        children: [
          {
            text: '',
          },
        ],
        id: element.id,
        width,
        float: null,
        alt: selectedAltValue.current,
        href: hrefValue,
      },
      { at: [index] }
    );
    needInsertNewNode(index);
  };

  const changeAlt = () => {
    setShowAlt(false);
    const index = findImageLocation();
    Transforms.setNodes(
      editor,
      {
        type: 'image',
        url: element.url,
        children: [
          {
            text: '',
          },
        ],
        id: element.id,
        width,
        float,
        alt: selectedAltValue.current,
        href: hrefValue,
      },
      { at: [index] }
    );
    needInsertNewNode(index);
  };

  const changeHref = () => {
    setShowHref(false);
    const index = findImageLocation();
    Transforms.setNodes(
      editor,
      {
        type: 'image',
        url: element.url,
        children: [
          {
            text: '',
          },
        ],
        id: element.id,
        width,
        float,
        alt: selectedAltValue.current,
        href: hrefValue,
      },
      { at: [index] }
    );
    needInsertNewNode(index);
  };

  return (
    <div
      style={{
        position: 'relative',
        float: element.float ? element.float : '',
        clear: 'both',
        margin: width === 'w-150' ? '0 -120px' : '0 auto',
        width:
          width === 'w-100' && !float
            ? '100%'
            : width === 'w-50'
            ? '50%'
            : width === 'w-150'
            ? 'calc(100% + 240px)'
            : '50%',
        borderRadius: '16px',
        ...(element.float === 'left' && {
          marginRight: '8px !important',
        }),

        ...(element.float === 'right' && {
          marginLeft: '8px !important',
        }),
        marginTop: 8,
      }}
      {...attributes}
      contentEditable={false}
    >
      <Button
        onClick={() => setShowAlt(true)}
        variant="primary"
        sx={{
          backgroundColor: (theme) => `${theme.palette.grey[100]}!important`,
          position: 'absolute',
          top: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
          outline: 'none!important',
        }}
      >
        <Stack spacing={1} alignItems="center" direction="row">
          <img src="/icons/Edit/24/Outline.svg" width={24} height={24} alt="edit" />
          <Typography variant="caption" sx={{ color: 'common.black' }}>
            Add alt text
          </Typography>
        </Stack>
      </Button>
      {showPostionsOptions && (
        <Stack
          direction="row-reverse"
          spacing={2}
          onMouseEnter={() => setShowPostionsOptions(true)}
          onMouseLeave={() => setShowPostionsOptions(false)}
          sx={{ position: 'absolute', top: -56, right: 0, left: 0, height: 56 }}
        >
          <IconButtonStyle active={!!hrefValue} onClick={() => setShowHref(!showHref)}>
            <Image src="/icons/advanced-editor/link.svg" width={24} height={24} alt="link" />
          </IconButtonStyle>
          <IconButtonStyle active={float === 'right' ? true : false} onClick={() => changeFloat('right')}>
            <Image src="/icons/advanced-editor/float-right.svg" width={24} height={24} alt="link" />
          </IconButtonStyle>
          <IconButtonStyle active={width === 'w-50' ? true : false} onClick={() => changeWidth('w-50')}>
            <Image src="/icons/advanced-editor/w-50.svg" width={24} height={24} alt="link" />
          </IconButtonStyle>
          <IconButtonStyle active={width === 'w-100' ? true : false} onClick={() => changeWidth('w-100')}>
            <Image src="/icons/advanced-editor/w-100.svg" width={24} height={24} alt="link" />
          </IconButtonStyle>
          {/* <IconButtonStyle  onClick={() => changeWidth('w-150')}>
            <Image src="/icons/advanced-editor/w-50.svg" width={24} height={24} alt="link" />
          </IconButtonStyle> */}
          <IconButtonStyle active={float === 'left' ? true : false} onClick={() => changeFloat('left')}>
            <Image src="/icons/advanced-editor/float-left.svg" width={24} height={24} alt="link" />
          </IconButtonStyle>
        </Stack>
      )}

      <img
        className="inserted-image"
        id={element.id}
        src={element.url}
        style={{
          display: 'block',
          width: '100%',
          boxShadow: `${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'}`,
          borderRadius: '16px',
        }}
        alt={selectedAltValue.current}
        onMouseEnter={() => setShowPostionsOptions(true)}
        onMouseLeave={() => setShowPostionsOptions(false)}
      />
      {showAlt && (
        <Stack
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            bgcolor: 'text.primary',
            opacity: 0.9,
            padding: 6,
          }}
          spacing={2}
        >
          <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
            Add alt text
          </Typography>
          <Typography variant="body2" sx={{ color: 'common.white' }}>
            The text you add here will only be seen by users with visual disabilities. It will not be visible on the
            article itself.
          </Typography>
          <Box />
          <TextField
            placeholder="Text describing the photo"
            sx={{
              color: (theme) => `${theme.palette.common.white}!important`,
              '& input': {
                color: (theme) => `${theme.palette.common.white}!important`,
              },
              '& ::before': {
                border: 'none!important',
              },
              '& ::after': {
                border: 'none!important',
              },
            }}
            onChange={(e) => setAltValue(e.target.value)}
            value={altValue}
            id="alt inserting"
            variant="standard"
          />

          <Stack justifyContent="flex-end" spacing={2} direction="row" sx={{ marginTop: 11 }}>
            <Button
              onClick={() => {
                setShowAlt(false);
                setAltValue(alt);
              }}
              variant="outlined"
              sx={{ color: 'white', border: (theme) => `1px solid ${theme.palette.common.white}!important` }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              sx={{
                bgcolor: (theme) => `${theme.palette.common.white}!important`,
                border: 'none!important',
                outline: 'none!important',
                color: (theme) => `${theme.palette.text.primary}!important`,
              }}
              onClick={() => {
                selectedAltValue.current = altValue;
                changeAlt();
              }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      )}

      {showHref && (
        <ClickAwayListener onClickAway={() => setShowHref(false)}>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}
          >
            <Stack
              sx={{
                bgcolor: 'common.white',
                borderRadius: 1,
                padding: 1,
                boxShadow: '0px 16px 32px rgba(53, 71, 82, 0.16)',
              }}
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <TextField
                onChange={(e) => setHrefValue(e.target.value)}
                value={hrefValue}
                sx={{ width: 200 }}
                variant="outlined"
                placeholder="Past or type a link"
              />
              <Button
                variant="link"
                onClick={() => {
                  changeHref();
                }}
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </ClickAwayListener>
      )}

      {children}
    </div>
    // </div>
  );
};

export default ImageElement;
