import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
    link: true;
  }
}

export default function Button(theme: Theme) {
  return {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        // root: {
        //   '&:hover': {
        //     boxShadow: 'none',
        //   },
        // },
        // sizeLarge: {
        //   paddingTop: 11,
        //   paddingBottom: 11,
        // },
        // sizeMedium: {
        //   paddingTop: 7,
        //   paddingBottom: 7,
        // },
        // // contained
        // containedInherit: {
        //   color: theme.palette.grey[800],
        //   boxShadow: theme.customShadows.z8,
        //   '&:hover': {
        //     backgroundColor: theme.palette.grey[400],
        //   },
        // },
        // containedPrimary: {
        //   boxShadow: theme.customShadows.primary,
        // },
        // containedSecondary: {
        //   boxShadow: theme.customShadows.secondary,
        // },
        // containedInfo: {
        //   boxShadow: theme.customShadows.info,
        // },
        // containedSuccess: {
        //   boxShadow: theme.customShadows.success,
        // },
        // containedWarning: {
        //   boxShadow: theme.customShadows.warning,
        // },
        // containedError: {
        //   boxShadow: theme.customShadows.error,
        // },
        // // outlined
        // outlinedInherit: {
        //   border: `1px solid ${theme.palette.grey[500_32]}`,
        //   '&:hover': {
        //     backgroundColor: theme.palette.action.hover,
        //   },
        // },
        // textInherit: {
        //   '&:hover': {
        //     backgroundColor: theme.palette.action.hover,
        //   },
        // },
        root: {
          height: 40,
          '&.MuiButton-primary': {
            backgroundColor: theme.palette.primary.main,
            ...theme.typography.button,
            color: '#ffffff',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            '&:active': {
              outline: `${theme.palette.primary.main} solid 2px`,
            },
            '&.MuiLoadingButton-loading': {
              opacity: '1!important',
              '& .MuiCircularProgress-root': {
                color: '#ffffff',
              },
            },
            '&.Mui-disabled': {
              opacity: 0.3,
            },
          },
          '&.MuiButton-secondary': {
            ...theme.typography.button,
            border: `1px solid ${theme.palette.surface.onSurfaceVariantL}`,
            color: theme.palette.grey[900],
            '&:hover': {
              border: `1px solid ${theme.palette.surface.onSurfaceVariantD}`,
            },
            '&:active': {
              outline: `${theme.palette.surface.onSurfaceVariant} solid 2px`,
            },
            '&.MuiLoadingButton-loading': {
              opacity: '1!important',
              border: `1px solid ${theme.palette.surface.onSurfaceVariant}`,
              '& .MuiCircularProgress-root': {
                color: theme.palette.primary.main,
              },
            },
            '&.Mui-disabled': {
              border: `1px solid ${theme.palette.surface.onSurfaceVariant}`,
              opacity: 0.3,
            },
          },
          '&.MuiButton-link': {
            ...theme.typography.button,
            color: theme.palette.surface.onSurface,
            '&.MuiLoadingButton-loading': {
              opacity: '1!important',
              '& .MuiCircularProgress-root': {
                color: theme.palette.primary.main,
              },
            },
            '&.Mui-disabled': {
              opacity: 0.3,
            },
          },
        },
      },
    },
  };
}
