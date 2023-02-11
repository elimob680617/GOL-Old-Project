import { pxToRem } from '../utils/getFontValue';

// ----------------------------------------------------------------------

// const FONT_PRIMARY = 'Public Sans, sans-serif'; // Google Font
// const FONT_SECONDARY = 'CircularStd, sans-serif'; // Local Font
const FONT_LEXEND_BOLD = 'lexend-bold'; // Local Font
const FONT_LEXEND_REGULAR = 'lexend-regular'; // Local Font
const FONT_LEXEND_MEDIUM = 'lexend-medium'; // Local Font
const FONT_LEXEND_LIGHT = 'lexend-light'; // Local Font

const typography = {
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontFamily: FONT_LEXEND_BOLD,
    fontWeight: 700,
    lineHeight: '80px',
    fontSize: pxToRem(64),
    // letterSpacing: 2,
  },
  h2: {
    fontFamily: FONT_LEXEND_BOLD,
    fontWeight: 700,
    lineHeight: '60px',
    fontSize: pxToRem(48),
  },
  h3: {
    fontFamily: FONT_LEXEND_BOLD,
    fontWeight: 700,
    lineHeight: '40px',
    fontSize: pxToRem(32),
  },
  h4: {
    fontFamily: FONT_LEXEND_BOLD,
    fontWeight: 700,
    lineHeight: '30px',
    fontSize: pxToRem(24),
  },
  h5: {
    fontFamily: FONT_LEXEND_BOLD,
    fontWeight: 700,
    lineHeight: '25px',
    fontSize: pxToRem(20),
  },
  h6: {
    fontFamily: FONT_LEXEND_BOLD,
    fontWeight: 700,
    lineHeight: '23px',
    fontSize: pxToRem(18),
  },
  subtitle1: {
    fontFamily: FONT_LEXEND_MEDIUM,
    fontWeight: 500,
    lineHeight: '20px',
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontFamily: FONT_LEXEND_REGULAR,
    fontWeight: 400,
    lineHeight: '18px',
    fontSize: pxToRem(14),
  },
  body1: {
    fontFamily: FONT_LEXEND_LIGHT,
    fontWeight: 300,
    lineHeight: '20px',
    fontSize: pxToRem(16),
  },
  body2: {
    fontFamily: FONT_LEXEND_LIGHT,
    fontWeight: 300,
    lineHeight: '18px',
    fontSize: pxToRem(14),
  },
  caption: {
    fontFamily: FONT_LEXEND_REGULAR,
    fontWeight: 400,
    lineHeight: '15px',
    fontSize: pxToRem(12),
  },
  overline: {
    fontFamily: FONT_LEXEND_MEDIUM,
    fontWeight: 500,
    lineHeight: '15px',
    fontSize: pxToRem(12),
  },
  button: {
    fontFamily: FONT_LEXEND_LIGHT,
    fontWeight: 300,
    lineHeight: '24px',
    fontSize: pxToRem(14),
    textTransform: 'capitalize',
  },
} as const;

export const inputTitle = {
  fontFamily: FONT_LEXEND_BOLD,
  fontSize: 12,
  lineHeight: '15px',
  fontWeight: 700,
  wordSpacing: 1.2,
};

export default typography;
