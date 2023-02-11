import React, { FC } from 'react';
import { FilterByEnum } from 'src/@types/sections/serverTypes';
import { Avatar, styled } from '@mui/material';

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
}));
const AvatarChecker: FC<{ userType: FilterByEnum; fullName: string; avatarUrl?: string }> = ({
  userType,
  fullName,
  avatarUrl,
}) => (
  <AvatarStyle src={avatarUrl} variant={userType === 'NGO' ? 'rounded' : 'circular'}>
    {fullName?.slice(0, 1).toUpperCase()}
  </AvatarStyle>
);

export default AvatarChecker;
