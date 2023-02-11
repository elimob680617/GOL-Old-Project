import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function LoadingButton(theme: Theme) {
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-text': {
            '& .MuiLoadingButton-startIconPendingStart': {
              marginLeft: 0,
            },
            '& .MuiLoadingButton-endIconPendingEnd': {
              marginRight: 0,
            },
          },
          '&.MuiButton-containedPrimary': {
            '& > div.MuiLoadingButton-loadingIndicator': {
              color: theme.palette.primary.main,
            },
            '&.Mui-disabled': {
              background: `${theme.palette.primary.main}4C`,
              color: theme.palette.background.paper,
              // opacity: 0.3,
            },
          },
        },
      },
    },
  };
}
