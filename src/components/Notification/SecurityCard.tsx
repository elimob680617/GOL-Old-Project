import { Box, Divider, Typography } from '@mui/material';
import React from 'react';
import { Icon } from '../Icon';
import { styled } from '@mui/material/styles';

interface ISecurityCard {
  item: any;
}
const IconCircle = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.grey[100],
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 8,
}));
function SecurityCard(props: ISecurityCard) {
  const { item } = props;
  return (
    <Box>
      <Box
        sx={{
          mt: 1,
          p: 1,
          borderRadius: '8px',
        }}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        flexWrap={'wrap'}
      >
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <IconCircle>
            <Icon
              name={item.Icon}
              color={item.Icon === 'location' ? 'warning.main' : item.Icon === 'mobile' ? 'error.main' : 'primary.main'}
            />
          </IconCircle>
          <Typography variant="caption" sx={{ maxWidth: 350 }}>
            {item.notification}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.disabled">
            {item.time}
          </Typography>
        </Box>
      </Box>
      <Divider />
    </Box>
  );
}

export default SecurityCard;
