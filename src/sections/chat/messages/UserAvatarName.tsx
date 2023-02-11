import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react';

const UserAvatarName = () => (
  <Stack sx={{ alignItems: 'center' }}>
    <Avatar sx={{ height: 88, width: 88 }} aria-label="avatar" src="/fake-images/fakeAvatar.jpg" alt="user" />
    <Typography gutterBottom variant="subtitle2" component="div" sx={{ margin: 0 }}>
      Franklin Weaver
    </Typography>
    <Typography variant="caption" color="text.secondary">
      CEO of GOL
    </Typography>
  </Stack>
);

export default UserAvatarName;
