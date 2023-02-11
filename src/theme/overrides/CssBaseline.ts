import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function CssBaseline(theme: Theme) {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          width: '100%',
          height: '100%',
          '&::-webkit-scrollbar': {
            width: 12,
          },

          '&::-webkit-scrollbar-track': {
            background: theme.palette.grey[0],
            borderRadius: 8,
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey[300],
            borderRadius: 10,
            border: `4px solid ${theme.palette.grey[0]}`,
          },
        },
        '#__next': {
          width: '100%',
          height: '100%',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        img: {
          display: 'block',
          maxWidth: '100%',
        },
        '.editor-paragraph': {
          color: theme.palette.text.primary,
          lineHeight: theme.spacing(2.5),
          minHeight: '1px',
        },
        '.editor-h1': {
          color: theme.palette.text.primary,
          lineHeight: theme.spacing(4.5),
        },
        '.editor-h2': {
          color: theme.palette.text.primary,
          lineHeight: theme.spacing(3.5),
        },
        '.editor-pre': {
          backgroundColor: theme.palette.grey[800],
          color: theme.palette.background.paper,
          padding: theme.spacing(2),
          borderRadius: theme.spacing(1),
          whiteSpace: 'pre-wrap',
        },
        '.editor-ol': {
          color: theme.palette.text.primary,
        },

        '.editor-link': {
          color: theme.palette.primary.main,
          fontWeight: 700,
        },
        '.editor-blockquote': {
          fontWeight: 700,
          fontSize: theme.spacing(2.5),
          borderLeft: `6px solid ${theme.palette.grey[300]}`,
          paddingLeft: theme.spacing(3),
        },
        '.editor-ul': {
          color: theme.palette.text.primary,
        },
        '.editor-list-item': {
          color: theme.palette.text.primary,
          marginBottom: theme.spacing(2),
        },
        '.editor-image': {
          // marginTop: theme.spacing(2),
          // marginBottom: theme.spacing(2),
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          objectFit: 'cover',
          borderRadius: theme.spacing(2),
          clear: 'both',
        },
        '.editor-bold': {
          color: theme.palette.text.primary,
          fontWeight: 'bold',
        },
        '.editor-italic': {
          color: theme.palette.text.primary,
          fontStyle: 'italic',
        },
        '.editor-underline': {
          color: theme.palette.text.primary,
          textDecoration: 'underline',
        },
        '.left': {
          float: 'left',
          marginRight: '8px !important',
          width: '50% !important',
        },
        '.right': {
          float: 'right',
          marginLeft: '8px !important',
          width: '50% !important',
        },
        '.w-50': {
          display: 'flex',
          margin: '8px auto',
          width: '50%',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'center',
        },
        '.w-100': {
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          margin: '8px auto',
        },
        'w-150': {
          position: 'relative',
          margin: ' 0px -80px',
          width: 'calc(100% + 160px)',
        },
        '.editor-youtube': {
          margin: '8px auto',
          display: 'block',
          width: '710px',
          height: '400px',
        },
        '.editor-tag': {
          color: theme.palette.primary.main,
          display: 'inline-block',
        },
      },
    },
  };
}
