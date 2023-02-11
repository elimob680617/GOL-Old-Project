import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

interface SurfaceColors {
  main: string;
  onSurface: string;
  onSurfaceVariant: string;
  onSurfaceVariantD: string;
  onSurfaceVariantL: string;
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
    onColor: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface Palette {
    surface: SurfaceColors;
    help: PaletteColor;
  }
}

declare module '@mui/material' {
  interface Color {
    0: string;
    500_8: string;
    500_12: string;
    500_16: string;
    500_24: string;
    500_32: string;
    500_48: string;
    500_56: string;
    500_80: string;
  }
}

// SETUP COLORS
export const PRIMARY = {
  lighter: '#C2E4E2',
  light: '#C2E4E2',
  main: '#13968E',
  dark: '#0E7E78',
  darker: '#0E7E78',
};
export const SECONDARY = {
  lighter: '#D27722',
  light: '#D27722',
  main: '#D27722',
  dark: '#C26B1B',
  darker: '#C26B1B',
};
export const SURFACE = {
  main: '#ffffff',
  onSurface: '#354752',
  onSurfaceVariant: '#607079',
  onSurfaceVariantD: '#8798A1',
  onSurfaceVariantL: '#C8D3D9',
};
export const INFO = {
  lighter: '#9BD5FF',
  light: '#9BD5FF',
  main: '#2092E4',
  dark: '#1479C2',
  darker: '#1479C2',
};
export const SUCCESS = {
  lighter: '#8FEDB4',
  light: '#8FEDB4',
  main: '#28BF64',
  dark: '#19A450',
  darker: '#19A450',
};
export const WARNING = {
  lighter: '#E49620',
  light: '#E49620',
  main: '#E49620',
  dark: '#C47B0D',
  darker: '#C47B0D',
};
export const ERROR = {
  lighter: '#F27E8C',
  light: '#F27E8C',
  main: '#BF283A',
  dark: '#BF283A',
  darker: '#BF283A',
};

export const GREY = {
  0: '#FFFFFF',
  100: '#F4F7FB',
  200: '#C8D3D9',
  300: '#C8D3D9',
  400: '#8798A1',
  500: '#8798A1',
  600: '#607079',
  700: '#607079',
  800: '#354752',
  900: '#354752',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
};

export const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
};

export const CHART_COLORS = {
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4'],
};

const COMMON = {
  surface: SURFACE,
  common: { black: '#354752', white: '#ffffff' },
  primary: { ...PRIMARY, contrastText: '#fff' },
  secondary: { ...SECONDARY, contrastText: '#fff' },
  info: { ...INFO, contrastText: '#fff' },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: '#fff' },
  grey: GREY,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  divider: GREY[500_24],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

const palette = {
  light: {
    ...COMMON,
    mode: 'light',
    text: { primary: GREY[800], secondary: '#8798A1', disabled: GREY[500] },
    background: { paper: '#fff', default: '#fff', neutral: '#F4F7FB' },
    action: { active: GREY[600], ...COMMON.action },
  },
  dark: {
    ...COMMON,
    mode: 'dark',
    text: { primary: '#fff', secondary: GREY[500], disabled: GREY[600] },
    background: { paper: GREY[800], default: GREY[900], neutral: GREY[500_16] },
    action: { active: GREY[500], ...COMMON.action },
  },
} as const;

export default palette;
