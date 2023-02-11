import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { PRIMARY } from 'src/theme/palette';
import { pxToRem } from 'src/utils/getFontValue';

const Endorse = styled('div')(({ theme }) => ({
  padding: '1rem',
}));
const EndorseCTA = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  alignContent: 'center',
  marginTop: pxToRem(24),
}));
const EndorseButton = styled('div')(({ theme }) => ({
  color: theme.palette.grey[900],
  padding: '0.5rem 1rem',
  border: '1px solid',
  borderColor: theme.palette.grey[300],
  borderRadius: '8px',
  width: pxToRem(120),
  height: pxToRem(40),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
}));
function PostEndorse() {
  return (
    <Endorse>
      <Typography variant="body1" color={PRIMARY}>
        Hanna Baldin added UX research to their skills and you can endorse it.
      </Typography>
      <EndorseCTA>
        <Typography variant="subtitle1" color={PRIMARY}>
          UX research
        </Typography>
        <EndorseButton>Endorse</EndorseButton>
      </EndorseCTA>
    </Endorse>
  );
}

export default PostEndorse;
