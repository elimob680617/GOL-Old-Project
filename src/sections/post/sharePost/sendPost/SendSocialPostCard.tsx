import { Avatar, Box, Divider, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import { PostCard, PostDescription } from 'src/components/Post';
import { PRIMARY } from 'src/theme/palette';
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
const VideoStyle = styled('video')(({ theme }) => ({
  borderRadius: 8,
}));
interface IPostCardInterface {
  sentPost: any;
}
type PostMediaType = 'video' | 'img';
interface IPostMedia {
  link: string;
  type: PostMediaType;
  thumbnail?: string;
}
function SocialPostCard(props: IPostCardInterface) {
  const { sentPost } = props;
  const [body, setBody] = useState<string>('');
  const [media, setMedia] = useState<IPostMedia[]>([]);
  const MentionElementCreator = (fullname: string, username: string, id: string) => (
    <Link href="">
      <Typography
        variant="subtitle1"
        color={PRIMARY.main}
        className="inserted-mention"
        id={id}
        sx={{
          padding: '0!important',
          verticalAlign: 'baseline',
          display: 'inline-block',
          lineHeight: '0',
        }}
      >
        {fullname}
      </Typography>
    </Link>
  );

  const TagElementCreator = (tag: string) => (
    <Link href="">
      <Typography
        variant="subtitle1"
        color={PRIMARY.main}
        className="inserted-tag"
        sx={{
          verticalAlign: 'baseline',
          display: 'inline-block',
          padding: '0!important',
          lineHeight: '0',
        }}
      >
        {tag}
      </Typography>
    </Link>
  );

  const BrElementCreator = () => <br />;

  const valuingMediaPost = useCallback(() => {
    const newMedia: IPostMedia[] = [];
    // post.pictureUrls.forEach((picture) => {
    //   newMedia.push({ link: picture, type: 'img' });
    // });

    // post?.videoUrls?.forEach((video) => {
    //   newMedia.push({ link: video, type: 'video', thumbnail: '' });
    // });

    sentPost?.mediaUrls?.forEach((value) => {
      newMedia.push({ link: value.url, type: value.isVideo ? 'video' : 'img' });
    });

    setMedia([...newMedia]);
  }, [sentPost?.mediaUrls]);

  useEffect(() => {
    if (!sentPost) return;
    let body = sentPost?.body;
    const mentions = body?.match(/╣(.*?)╠/g) || [];
    const tags = body?.match(/#(.*?)\s/g) || [];

    body = body?.replace(/\\n/g, ReactDOMServer.renderToStaticMarkup(BrElementCreator()));

    mentions.forEach((mention) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      body = body.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue))
      );
    });

    tags.forEach((tag) => {
      body = body.replace(new RegExp(tag, 'g'), ReactDOMServer.renderToStaticMarkup(TagElementCreator(tag)));
    });

    setBody(body);
    valuingMediaPost();
  }, [sentPost, valuingMediaPost]);

  return (
    <PostCard>
      <Stack spacing={1}>
        <Stack direction={'row'} spacing={1} alignItems="center" sx={{ px: 2 }}>
          <Avatar
            sx={{ height: 32, width: 32 }}
            src={sentPost?.userAvatarUrl || ''}
            variant={sentPost?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
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
                <Icon name="Earth" color="grey.300" type="solid" />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction={'row'} sx={{ p: 1, margin: '8px !important' }} alignItems="center ">
          {media.length !== 0 && (
            <Stack>
              {media && media.findIndex((i) => i.type === 'video') >= 0 && (
                <Box>
                  <VideoStyle width={'64px'} height={'64px'}>
                    <source
                      key={media.find((i) => i.type === 'video')?.link}
                      src={media.find((i) => i.type === 'video')?.link}
                    />
                  </VideoStyle>
                </Box>
              )}
              {media && media.findIndex((i) => i.type === 'video') < 0 && media[0] && (
                <ImgStyle
                  // limitHeight={setGridFlex('img', 1) === 6 ? true : false}
                  key={media[0].link}
                  src={
                    media[0].link.indexOf('http') >= 0 || media[0].link.indexOf('https') >= 0
                      ? media[0].link
                      : `http://${media[0].link}`
                  }
                  width={'64px'}
                  height={'64px'}
                  sx={{ borderRadius: 1 }}
                />
              )}
            </Stack>
          )}

          <PostDescription description={body || ''} isSent={true} />
        </Stack>
      </Stack>
    </PostCard>
  );
}

export default SocialPostCard;
