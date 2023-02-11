import { Box, CircularProgress } from '@mui/material';

const LoadingCircular = () => (
  <Box sx={{ width: '100%', textAlign: 'center' }}>
    <CircularProgress
      sx={{
        color: (theme) => theme.palette.primary.main,
      }}
      size={28}
      thickness={2}
    />
  </Box>
);

export default LoadingCircular;
