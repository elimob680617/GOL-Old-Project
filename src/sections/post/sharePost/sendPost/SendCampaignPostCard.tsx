import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import { PostCard } from 'src/components/Post';
//icon
import { Icon } from 'src/components/Icon';

const ImgStyle = styled('img')(({ theme }) => ({
  display: 'block',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  objectFit: 'cover',
}));
const PostTitleDot = styled('span')(({ theme }) => ({
  color: theme.palette.grey[300],
  margin: 1,
}));
const SentPostTitle = styled(Box)(({ theme }) => ({
  display: '-webkit-box',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));
interface IPostCardInterface {
  sentPost: any;
}
function CampaignPostCard(props: IPostCardInterface) {
  const { sentPost } = props;
  return (
    <PostCard>
      <Stack spacing={1}>
        <Stack direction={'row'} spacing={1} alignItems="center" sx={{ px: 2 }}>
          <Avatar
            sx={{ height: 32, width: 32 }}
            src={sentPost?.userAvatarUrl || ''}
            variant={sentPost?.userType === UserTypeEnum.Ngo ? 'rounded' : 'rounded'}
          />
          <Stack spacing={0.5}>
            <Typography variant="subtitle1">
              {sentPost?.firstName && sentPost?.lastName ? `${sentPost?.firstName} ${sentPost?.lastName}` : ''}
            </Typography>
            <Stack alignItems="center" direction="row" spacing={1}>
              <Typography variant="caption" color="text.secondary">
                {sentPost?.createdDateTime}
              </Typography>
              <PostTitleDot>
                <Stack justifyContent="center">
                  <Image src="/icons/dot.svg" width={5} height={5} alt="selected-location" />
                </Stack>
              </PostTitleDot>

              <Stack justifyContent="center">
                <Icon name="Earth" type="linear" color="grey.300" />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction={'row'} spacing={1.5} sx={{ p: 1, margin: '8px !important' }} alignItems="center ">
          <ImgStyle src={sentPost?.coverImageUrl} width={'64px'} height={'64px'} sx={{ borderRadius: 1 }} />
          <SentPostTitle>
            <Typography variant="body2">{sentPost?.title}</Typography>
          </SentPostTitle>
        </Stack>
      </Stack>
    </PostCard>
  );
}

export default CampaignPostCard;
