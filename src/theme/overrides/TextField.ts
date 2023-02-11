import { Theme } from '@mui/material/styles';
import { inputTitle } from '../typography';

// ----------------------------------------------------------------------

export default function Fab(theme: Theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          '.MuiOutlinedInput-root': {
            input: {
              ...inputTitle,
              height: 23,
            },
            '& fieldset': {
              borderColor: theme.palette.surface.onSurfaceVariantL,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.surface.onSurface,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-disabled fieldset': {
              borderColor: theme.palette.surface.onSurfaceVariantL,
            },
            '& .MuiSvgIcon-root': {
              color: theme.palette.background.neutral,
            },
            '&.Mui-error ': {
              '& .MuiSvgIcon-root': {
                color: theme.palette.error.main,
              },
              fieldset: {
                borderColor: theme.palette.error.main,
              },
            },
          },
          '.MuiInputLabel-root': {
            color: theme.palette.surface.onSurfaceVariant,
            '&.MuiFormLabel-filled': {
              color: theme.palette.surface.onSurface,
              fontWeight: 500,
            },
            '&.Mui-focused': {
              color: theme.palette.primary.main,
            },
            '&.Mui-error': {
              color: theme.palette.error.main,
            },
            '&.Mui-disabled': {
              color: theme.palette.surface.onSurfaceVariantL,
            },
          },
          '.MuiFormHelperText-root': {
            margin: 0,
            weight: 400,
            fontSize: 12,
          },
        },
      },
    },
  };
}
