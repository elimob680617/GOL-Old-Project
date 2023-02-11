import { Badge, Box, Stack, styled, Typography } from '@mui/material';

export const SearchBadgeStyle = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    minWidth: 'unset!important',
    width: '6px!important',
    height: '6px!important',
    right: '-4px!important',
  },
}));

export const StackStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const ImageStyle = styled('img')(({ theme }) => ({
  width: 24,
  height: 24,
}));

export const SearchWrapperStyle = styled(Stack)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
}));

export const HorizontalScrollerWithNoScroll = styled(Box)<{ spacing?: number }>(({ theme, spacing }) => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  ...(spacing && {
    '& .item:not(:last-child)': {
      marginRight: theme.spacing(spacing),
    },
  }),
}));

export const InlineBlockStyle = styled(Box)(({ theme }) => ({
  display: 'inline-block',
}));

export const ElipsesText = styled(Typography)<{ hasOverflow?: boolean }>(({ theme, hasOverflow }) => ({
  position: 'relative',
  ...(hasOverflow && {
    '&:focus, &:hover': {
      overflow: 'visible',
      color: 'transparent',

      '&:after': {
        content: 'attr(data-text)',
        overflow: 'visible',
        textOverflow: 'inherit',
        position: 'absolute',
        left: '0',
        top: '0',
        // whiteSpace: 'normal',
        // wordWrap: 'break-word',
        // display: 'block',
        zIndex: 2,
        color: theme.palette.text.primary,
        // maxWidth: 'min-content',
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 2px 4px 0px rgba(0,0,0,.28)',
        padding: theme.spacing(1),
        borderRadius: theme.spacing(1),
      },
    },
  }),
}));

export const SearchWrapper = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 1,
  flex: 1,
  padding: theme.spacing(3, 2),
  maxHeight: 'calc(100vh - 185px)',
  overflowX: 'hidden',
  overflowY: 'auto',
  width: '100%',
}));

export const SearchSidebarStyled = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  maxWidth: 264,
  position: 'sticky',
  top: 152,
  maxHeight: `calc(100vh - 188px)`,
  overflow: 'auto',
}));

export const PostWrapperStyle = styled(Stack)(({ theme }) => ({
  width: 480,
  marginRight: 'auto!important',
  marginLeft: 'auto!important',
}));

export const ClickableText = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
}));
