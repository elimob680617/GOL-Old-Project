import { AvatarGroup, Avatar, Typography, Stack } from '@mui/material';
import { FC } from 'react';
interface IPostCounter {
  counter?: any;
  lastpersonName?: any;
  lastpersonsData?: any;
  Comments?: string;
  type: boolean;
  endorseTitle?: string;
}

const PostCounter: FC<IPostCounter> = ({ counter, lastpersonsData, Comments, type }) => (
  <Stack alignItems="center" justifyContent="space-between" direction="row">
    <Stack spacing={0.5} direction="row" alignItems="center">
      <AvatarGroup max={4} total={0}>
        {lastpersonsData?.map((item: any) => (
          <Avatar key={item.id} sx={{ width: 16, height: 16 }} alt={item.fullName} src={item.avatarUrl} />
        ))}
      </AvatarGroup>
    </Stack>
    {counter === 1 ? (
      <Typography variant="button">{lastpersonsData?.[0]?.fullName} liked this post</Typography>
    ) : (
      <Typography variant="button">
        {lastpersonsData?.[0]?.fullName} and {counter - 1} others liked this post
      </Typography>
    )}
  </Stack>
);

export default PostCounter;
