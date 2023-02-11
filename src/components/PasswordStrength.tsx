import { LinearProgress, Stack, Typography } from '@mui/material';
import checkPassword from 'src/utils/checkPassword';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const { color, strength, message } = checkPassword(password);
  return (
    <Stack direction="row" alignItems="center" sx={{ px: 1 }}>
      <LinearProgress color={color} variant="determinate" value={strength} sx={{ flexGrow: 1 }} />
      <Typography color={color + '.main'} sx={{ pl: 2 }} variant="caption">
        {message}
      </Typography>
    </Stack>
  );
}
