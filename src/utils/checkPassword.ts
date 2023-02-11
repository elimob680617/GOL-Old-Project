import { LinearProgressProps } from '@mui/material';

type CheckPasswordResultType = {
  message: string;
  strength: number;
  color: LinearProgressProps['color'];
};
// eslint-disable-next-line import/no-anonymous-default-export
export default function (password: string): CheckPasswordResultType {
  const result = {
    strength: 0,
    color: 'inherit',
    message: 'Too Week',
  } as CheckPasswordResultType;

  const colors = ['primary', 'error', 'warning', 'warning', 'success'];
  const messages = ['Too Week', 'Too Week', 'Could Be Stronger', 'Could Be Stronger', 'Strong Password'];

  if (password.match(/[a-z]+/)) {
    result.strength += 1;
  }
  if (password.match(/[A-Z]+/)) {
    result.strength += 1;
  }
  if (password.match(/[0-9]+/)) {
    result.strength += 1;
  }
  if (password.match(/[$@#&!]+/)) {
    result.strength += 1;
  }

  result.message = messages[result.strength];
  result.color = colors[result.strength] as LinearProgressProps['color'];
  result.strength = result.strength * password.length;

  result.strength > 99 && (result.strength = 100);

  // console.log(result);

  return result;
}
