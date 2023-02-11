import { useState, useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Avatar, Badge, Box, CardActionArea, Stack, styled, useTheme } from '@mui/material';
// import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    top: '50%',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    backgroundColor: '#BF283A',
    color: theme.palette.grey[0],
  },
}));

const StyledCard = styled(CardActionArea)(({ theme }) => ({
  actionArea: {
    '&:hover $focusHighlight': {
      opacity: 0,
    },
  },
  focusHighlight: {},
}));
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  height: '48px',
  width: '48px',
  borderColor: theme.palette.primary.main,
}));

const OneUser = ({ checkActive, id, user }) => {
  const [queryId, setQueryId] = useState('');
  const theme = useTheme();
  const query = useRouter();
  useEffect(() => {
    if (query.query.id) {
      setQueryId(query.query.id[0]);
    }
    return () => {
      setQueryId('');
    };
  }, [query.query]);

  return (
    <Box>
      <StyledBadge badgeContent={30} max={9} sx={{ width: '95%' }} invisible>
        <StyledCard
          onClick={() => {
            query.push(user.roomId);
          }}
        >
          <CardContent sx={{ padding: theme.spacing(1.5, 0) }}>
            <Stack direction="row" spacing={3}>
              <StyledAvatar
                sx={{ borderWidth: checkActive !== 3 ? 'none' : 2 }}
                aria-label="avatar"
                src={user.avatarUrl || ''}
                alt="user"
              />
              <Stack sx={{ color: queryId === user.roomId ? 'primary.main' : 'unset' }}>
                <Typography gutterBottom variant="subtitle1" component="div" sx={{ margin: theme.spacing(0) }}>
                  {user.fullName}
                </Typography>
                <Typography variant="caption" color={checkActive === 3 ? 'primary.main' : 'text.secondary'}>
                  {user.lastMessage}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </StyledCard>
      </StyledBadge>
    </Box>
  );
};
export default OneUser;
