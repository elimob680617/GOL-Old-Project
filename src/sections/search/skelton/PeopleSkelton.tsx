import { Skeleton } from '@mui/material';
import { FC } from 'react';
import { PeopleItemStyle } from '../people/PeopleItem';

const PeopleSkelton: FC = () => (
  <PeopleItemStyle sx={{ p: 2, width: '100%' }}>
    <Skeleton variant="circular" width={48} height={48} />
    <Skeleton variant="text" width={112} height={20} />
    <Skeleton variant="text" width={76} height={17} />
  </PeopleItemStyle>
);

export default PeopleSkelton;
