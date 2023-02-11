import { Stack, Tooltip, Typography } from '@mui/material';
import { FC, useRef } from 'react';
import { Icon } from 'src/components/Icon';
import { LinearIconType, SolidIconType } from 'src/components/Icon/IconNames';
import useIsOverflow from 'src/hooks/useIsOverflow';

const CampaginReportItem: FC<{
  title: string;
  icon: SolidIconType | LinearIconType;
  value: string | number;
  iconSize: number;
}> = ({ icon, title, value, iconSize }) => (
  <Stack
    padding={2}
    sx={{ bgcolor: 'background.neutral', borderRadius: 1 }}
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    spacing={2}
  >
    <Stack direction="row" alignItems="center" spacing={1}>
      <Stack alignItems="center" justifyContent="center" sx={{ borderRadius: 40, p: 1, bgcolor: 'common.white' }}>
        <Icon name={icon} color="text.secondary" size={iconSize} />
      </Stack>
      <Typography sx={{ whiteSpace: 'pre' }}>{title}</Typography>
    </Stack>
    <Tooltip title={value}>
      <Typography noWrap variant="subtitle1" color="text.primary">
        {value}
      </Typography>
    </Tooltip>
  </Stack>
);

export default CampaginReportItem;
