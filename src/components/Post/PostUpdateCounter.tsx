import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

function PostUpdateCounter({ updatePercent }: any) {
  return (
    <Box
      sx={{
        m: 2,
        bgcolor: (theme) => theme.palette.grey[100],
        height: '3.5rem',
        borderRadius: '15px',
        color: (theme) => theme.palette.primary.main,
        p: 1,
      }}
      display="flex"
      justifyContent={'flex-start'}
      alignItems={'center'}
    >
      <CircularProgress variant="determinate" value={updatePercent} />
      <Typography sx={{ pl: 1 }} variant="subtitle1">
        {updatePercent}% Update
      </Typography>
    </Box>
  );
}

export default PostUpdateCounter;
