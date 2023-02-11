import { Box, BoxProps, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface LoadingDotsProps extends BoxProps {
  amount?: number;
  speed?: number;
  minToShow?: number;
}

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

export default function LoadingDots({ amount = 3, minToShow = 0, speed = 500, ...props }: LoadingDotsProps) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count < amount) {
        setCount(count + 1);
      } else {
        setCount(minToShow);
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [count]);

  return (
    <Box {...props}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Typography key={i} component="span">
            {bull}
          </Typography>
        ))}
    </Box>
  );
}
