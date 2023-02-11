import { useTheme } from '@mui/material';
import IcomoonReact from 'icomoon-react';
import { LinearIconType, SolidIconType } from './IconNames';
const iconLinearSet = require('./IconLinear.json');
const iconSolidSet = require('./IconSolid.json');

interface IconProps {
  color?: string;
  size?: string | number;
  type?: 'solid' | 'linear';
  name: SolidIconType | LinearIconType;
  className?: string;
}

const Icon = (props: IconProps) => {
  const { name, size = 24, className, color = 'grey.700', type = 'linear' } = props;
  const theme = useTheme();
  const colorSplit = color.split('.');
  return (
    <IcomoonReact
      className={className}
      iconSet={type === 'linear' ? iconLinearSet : iconSolidSet}
      color={theme.palette[colorSplit[0]][colorSplit[1]]}
      size={size}
      icon={name as string}
    />
  );
};

export default Icon;
