// import { createTheme, ThemeOptions } from "@mui/material/styles";
import breakpoints from './breakpoints';
import palette from './palette';
import shadows, { customShadows } from './shadows';
import typography from './typography';
import componentsOverride from './overrides';
import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  // palette: isLight ? palette.light : palette.dark,
  palette: palette.light,
  typography,
  breakpoints,
  shape: { borderRadius: 8 },
  // direction: themeDirection,
  direction: 'ltr',
  // shadows: isLight ? shadows.light : shadows.dark,
  shadows: shadows.light,
  // customShadows: isLight ? customShadows.light : customShadows.dark,
  customShadows: customShadows.light,
};

const theme = createTheme(themeOptions);
theme.components = componentsOverride(theme);

const exportedTheme = theme;

export default exportedTheme;
