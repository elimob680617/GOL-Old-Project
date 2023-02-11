import { Avatar, Badge, Box, Typography } from '@mui/material';
import React from 'react';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from '../Icon';
import { styled } from '@mui/material/styles';

type ItemData = {
  id: number;
  useAvatar: string;
  userName: string;
  userType: string;
  action: string;
  time: string;
  status: boolean;
  cardType: string;
};
interface IGroupingCard {
  item: ItemData;
}
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.surface.main,
    borderRadius: '50%',
    height: 24,
    width: 24,
    padding: 0,
  },
}));

function GroupingCard(props: IGroupingCard) {
  const { item } = props;
  return (
    <Box
      sx={{
        mt: 1,
        p: 1,
        borderRadius: '8px',
        bgcolor: item.status ? (theme) => theme.palette.grey[100] : null,
      }}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      flexWrap={'wrap'}
    >
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <StyledBadge
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          badgeContent={item.cardType === 'video' ? <Icon name="Video" size={18} /> : <Icon name="image" size={18} />}
          overlap="circular"
        >
          <Avatar
            src={item.useAvatar}
            variant={item?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
            {...stringAvatar(item.userName)}
          />
        </StyledBadge>
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2">{item.userName}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 350 }}>
            {item.action}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" color="text.disabled">
        {item.time}
      </Typography>
    </Box>
  );
}

export default GroupingCard;
