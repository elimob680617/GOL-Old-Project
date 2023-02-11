import {
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  Avatar,
  Box,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useEffect, useRef, useState } from 'react';
import { PostTitle, PostDescription, PostCounter, PostActions } from 'src/components/Post';
import { useLazyGetSocialPostQuery } from 'src/_requests/graphql/post/getSocialPost.generated';
import ReactDOMServer from 'react-dom/server';
import Link from 'next/link';
import { PRIMARY, SURFACE } from 'src/theme/palette';
import { initialState } from 'src/redux/slices/post/createSocialPost';
import { jsx } from 'slate-hyperscript';
import { styled } from '@mui/material/styles';
import closeIcon from 'public/icons/Close/24/Outline.svg';
import rightArrow from 'public/icons/right arrow/24/Outline.svg';
import leftArrow from 'public/icons/left arrow/24/Outline.svg';
import cameraIcon from 'public/icons/camera/24/Outline.svg';
import SimpleVideo from 'src/components/video/SimpleVideo';
type PostMediaType = 'video' | 'img';

interface IPostMedia {
  link: string;
  type: PostMediaType;
  thumbnail?: string;
}
interface IImageStyleProps {
  limitHeight: boolean;
}
const ImgStyle = styled('img')<IImageStyleProps>(({ theme, limitHeight }) => ({
  maxHeight: 400,
  width: '80%',
  margin: 'auto',
}));

const CarouselArrow = styled(IconButton)((theme) => ({
  backgroundColor: SURFACE.main,
  height: 32,
  width: 32,
}));

const MediaDialog: FC<{ id: string; open: boolean; onClose: () => void }> = ({ id, open, onClose }) => {
  const theme = useTheme();
  const { push } = useRouter();
  const [body, setBody] = useState<string>('');
  const videoRef = useRef<any>(null);
  const [postCounter, setPostCounter] = useState([
    {
      id: 1,
      name: 'Remy Sharp',
      image: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fuser.02b413c5.jpg&w=1920&q=75',
    },
    {
      id: 2,
      name: 'Travis Howard',
      image: 'https://mui.com/static/images/avatar/1.jpg',
    },
    {
      id: 3,
      name: 'Cindy Baker',
      image: 'https://mui.com/static/images/avatar/2.jpg',
    },
    {
      id: 4,
      name: 'Agnes Walker',
      image: 'https://mui.com/static/images/avatar/3.jpg',
    },
  ]);
  const [media, setMedia] = useState<IPostMedia[]>([]);
  const [getSocialPost, { isLoading: getSocialPostLoading, data: socialPost }] = useLazyGetSocialPostQuery();
  const [post, setPost] = useState<any>([]);
  const [carousel, setCarousel] = useState<number>(0);

  const handleTextBodyEdit = () => {
    let editText = (post[0] as any)?.body;
    let mentionIndex = -1;
    let tagIndex = -1;
    let element: any = [];
    let children: any[] = [];
    let bodyText = '';
    let editTextIndex = 0;

    if (editText.length === 0) {
      children = initialState.text;
    }

    while (editText.length > 0) {
      if (editText[editTextIndex] !== '╣' && editText[editTextIndex] !== '#' && editText[editTextIndex] !== '\\') {
        bodyText += editText[editTextIndex];
        editTextIndex++;
        if (editText[editTextIndex] === null || editText[editTextIndex] === undefined) {
          editText = '';
          editTextIndex = 0;
          element.push({ text: bodyText });
          bodyText = '';
          children.push({ type: 'paragraph', children: element });
          break;
        }
      } else {
        editText = editText.substr(editTextIndex);
        editTextIndex = 0;
        element.push({ text: bodyText });
        bodyText = '';
        if (editText[editTextIndex] === '╣') {
          const mention = editText.match(/╣(.*?)╠/)[0];
          mentionIndex++;
          const mentionedValue = mention.replace('╣', '').replace('╠', '');
          element.push(
            jsx(
              'element',
              {
                type: 'mention',
                username: mentionedValue,
                fullname: mentionedValue,
                class: 'inserted-mention',
              },
              [{ text: '' }]
            )
          );
          element.push({ text: '' });
          editText = editText.replace(/╣(.*?)╠/, '');
        } else if (editText[editTextIndex] === '#') {
          const tag = editText.match(/#(.*?)\s/)[0];
          tagIndex++;
          const tagedValue = tag.replace('#', '');
          element.push(jsx('element', { type: 'tag', class: 'inserted-tag', title: tagedValue }, [{ text: '' }]));
          element.push({ text: '' });
          editText = editText.replace(/#(.*?)\s/, '');
        } else if (editText[editTextIndex] === '\\') {
          editText = editText.substr(2);
          children.push({ type: 'paragraph', children: element });
          element = [];
        }
      }

      if (editText === '') {
        children.push({ type: 'paragraph', children: element });
      }
    }

    return children;
  };

  useEffect(() => {
    if (!id || !open) return;
    getSocialPost({ filter: { dto: { id } } })
      .unwrap()
      .then((res) => {
        const postData: any[] = [];
        postData.push(res!.getSocialPost!.listDto!.items![0]! as any);
        setPost(postData);
      });
  }, [id, open]);

  useEffect(() => {}, [carousel]);

  const valuingMedia = () => {
    const newMedia: IPostMedia[] = [];
    // post[0]?.pictureUrls.forEach((picture) => {
    //   newMedia.push({ link: picture, type: 'img' });
    // });

    // post[0]?.videoUrls.forEach((video) => {
    //   newMedia.push({ link: video, type: 'video', thumbnail: '' });
    // });
    post[0]?.mediaUrls.forEach((value) => {
      newMedia.push({ link: value.url, type: value.isVideo ? 'video' : 'img' });
    });

    setMedia([...newMedia]);
  };
  const BrElementCreator = () => <br />;
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
  useEffect(() => {
    if (!post) return;
    let body = post[0]?.body;
    const mentions = body?.match(/╣(.*?)╠/g) || [];
    const tags = body?.match(/#(.*?)\s/g) || [];
    const newLines = body?.match(/[\\\/]/g) || [];

    body = body?.replace(/\\n/g, ReactDOMServer.renderToStaticMarkup(BrElementCreator()));

    mentions.forEach((mention) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      body = body?.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue))
      );
    });

    tags.forEach((tag) => {
      body = body?.replace(new RegExp(tag, 'g'), ReactDOMServer.renderToStaticMarkup(TagElementCreator(tag)));
    });

    setBody(body);
    valuingMedia();
  }, [post]);

  return (
    <Dialog
      onClose={() => onClose()}
      open={open}
      maxWidth="xl"
      fullWidth={true}
      aria-labelledby="responsive-dialog-title"
    >
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
        <DialogContent sx={{ height: 540, marginTop: 1, width: '40%', padding: 0 }}>
          <Box
            sx={{
              padding: 0,
              width: '100%',
              display: 'flex',
              flexDirection: 'row-reverse',
              boxShadow: '0 0 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
            }}
          >
            <Typography
              variant="subtitle1"
              color="GrayText.primary"
              sx={{ margin: 2.25 }}
              justifyContent={'flex-start'}
            >
              <IconButton onClick={() => onClose()}>
                <Image src={closeIcon} width={20} height={20} alt="close-button" />
              </IconButton>
            </Typography>
          </Box>
          {getSocialPostLoading && (
            <Stack alignItems="center">
              <CircularProgress />
            </Stack>
          )}
          <Box sx={{ padding: 2 }}>
            <PostTitle
              avatar={
                <Avatar
                  sx={{ height: 48, width: 48 }}
                  aria-label="recipe"
                  src={post[0]?.userAvatarUrl || ''}
                  alt="Hanna Baldin"
                />
              }
              username={post[0]?.firstName && post[0].lastName ? `${post[0]?.fullName}` : ''}
              PostNo={'simple'}
              Date={post[0]?.createdDateTime || ''}
              location={post[0]?.placeDescription}
              userId={post[0]?.ownerUserId}
              userType={post[0]?.userType}
              isMine={post[0]?.isMine}
              postId={post[0]?.id}
            />
            <PostDescription description={body || ''} />
            <Stack direction={'row'} sx={{ p: 2 }}>
              <PostCounter
                type={true} //Like & comments Counter
                counter={109}
                lastpersonName={'Davood Malekia'}
                lastpersonsData={postCounter}
                Comments={post[0]?.countOfComments || '0'}
              />
              <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 0.5 }}>
                Davood Malekia and 13.2k others liked this post.
              </Typography>
            </Stack>

            <PostActions
              like={post[0]?.countOfLikes || ''}
              comment={post[0]?.countOfComments || ''}
              share={post[0]?.countOfShared || ''}
              view={post[0]?.countOfViews || ''}
              id={post[0]?.id || ''}
            />
          </Box>
        </DialogContent>
        <DialogContent sx={{ height: 550, marginTop: 0, background: SURFACE.onSurface, width: '60%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
            }}
          >
            <Box sx={{ position: 'absolute', left: 2, top: 230 }}>
              <CarouselArrow
                onClick={() => {
                  carousel === 0 ? setCarousel(0) : setCarousel(carousel - 1);
                }}
              >
                <Image src={leftArrow} alt="" />
              </CarouselArrow>
            </Box>
            {media[carousel]?.type === 'img' ? (
              <ImgStyle
                limitHeight={true}
                key={media[carousel]?.link}
                src={
                  media[carousel]?.link.indexOf('http') >= 0 || media[carousel]?.link.indexOf('https') >= 0
                    ? media[carousel]?.link
                    : `http://${media[carousel]?.link}`
                }
              />
            ) : media[carousel]?.type === 'video' ? (
              <SimpleVideo autoShow controls src={media[carousel]?.link} maxHeight={400} />
            ) : null}
            <Box sx={{ position: 'absolute', right: 0, top: 230 }}>
              <CarouselArrow
                onClick={() => {
                  carousel === media.length ? setCarousel(media.length - 1) : setCarousel(carousel + 1);
                }}
              >
                <Image src={rightArrow} alt="" />
              </CarouselArrow>
            </Box>
          </Box>
          {/* <MediaCarousel media={media} arrows/> */}
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: '1rem',
              width: '55%',
            }}
          >
            {media.map((item, index) => (
              <Box
                sx={
                  carousel === index
                    ? {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'black',
                        marginLeft: 1,
                        marginRight: 1,
                        cursor: 'pointer',
                        border: `1px solid ${SURFACE.main}`,
                        borderRadius: '8px',
                      }
                    : {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'black',
                        marginLeft: 1,
                        marginRight: 1,
                        cursor: 'pointer',
                      }
                }
                key={index}
                onClick={() => setCarousel(index)}
              >
                {item.type === 'img' ? (
                  <Image
                    src={item.link}
                    height={carousel === index ? 72 : 56}
                    width={carousel === index ? 72 : 56}
                    alt=""
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: `${carousel === index ? 72 : 56}`,
                      height: `${carousel === index ? 72 : 56}`,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        color: SURFACE.main,
                        position: 'absolute',
                        fontSize: '8px',
                        bottom: '0.2rem',
                        left: '0.2rem',
                      }}
                    >
                      <Image src={cameraIcon} alt="camera" /> 02:10
                    </Box>
                    <SimpleVideo
                      src={item.link}
                      width={carousel === index ? 72 : 56}
                      height={carousel === index ? 72 : 56}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default MediaDialog;
