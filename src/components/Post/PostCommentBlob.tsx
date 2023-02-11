import { MoreHoriz, ThumbUpOutlined } from '@mui/icons-material';
import { Grid, Typography, Box, Menu, MenuItem, IconButton, useTheme, Avatar, CircularProgress } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { EntityType, UserTypeEnum } from 'src/@types/sections/serverTypes';
import { useCreateLikeMutation } from 'src/_requests/graphql/postbehavior/mutations/createLike.generated';
import PostCommentInput from './PostCommentInput';
import reportIcon from 'public/icons/flag/24/Outline.svg';
import DeleteIcon from 'public/icons/recyclebin.svg';
import useAuth from 'src/hooks/useAuth';
import ReactDOMServer from 'react-dom/server';
import PostCommentDescription from './PostCommentDescription';
import PostConfrimDialog from './PostConfrimDialog';
import Link from 'next/link';
import { PATH_APP } from 'src/routes/paths';

const PostCommetsBlob = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.neutral,
  padding: '1rem',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
}));

const PostCommetsText = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  '& $p': {
    width: '100%',
  },
}));
const PostCommetsTextFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 0',
}));

const PostCommentsTextFooterDot = styled('span')(({ theme }) => ({
  margin: '0 0.5rem',
}));
const PostCommentsLikeCounterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));
const PostCommentsLikeCounter = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  color: theme.palette.surface.main,
  width: '18px',
  height: '18px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '0.3rem',
}));
const IconButtonAction = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
interface IPostCommentBlob {
  data: any;
  isReplay?: boolean;
  hasMedia?: boolean;
  setGetNewComments: any;
  PostId: string;
  parentId?: string;
  postType?: any;
  commentsCount?: string | null | undefined;
  setCommentsCount?: any;
}

function PostCommentBlob(props: IPostCommentBlob) {
  const { data, isReplay, hasMedia, setGetNewComments, PostId, parentId, postType, commentsCount, setCommentsCount } =
    props;
  const [liked, setLiked] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [commentLikeMutation] = useCreateLikeMutation();
  const [replayOpen, setReplayOpen] = useState<boolean>(false);
  const [commentId, setCommentId] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [body, setBody] = useState<string>('');
  const [openPublishDialog, setOpenPublishDialog] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<string | null | undefined>('');
  const open = Boolean(anchorEl);
  const { user } = useAuth();
  const theme = useTheme();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const LikeDiv = styled(Box)(({ theme }) => ({
    color: liked || data.isLikedByUser ? theme.palette.primary.main : theme.palette.surface.onSurfaceVariant,
  }));
  const ReplayDiv = styled(Box)(({ theme }) => ({
    color: theme.palette.surface.onSurfaceVariant,
  }));

  const LikeHandler = (e) => {
    setLikeLoading(true);
    const commentId = data.id;
    commentLikeMutation({
      like: { dto: { entityType: EntityType.Comment, entityId: commentId } },
    })
      .unwrap()
      .then((res) => {
        const response = res?.createLike?.listDto?.items?.[0]?.isLike;
        if (response) {
          setLiked(true);
          setLikeLoading(false);
          setLikeCount(res?.createLike?.listDto?.items?.[0]?.count);
          // setGetNewComments(Math.random());
        } else if (!response) {
          setLiked(false);
          setLikeLoading(false);
          setLikeCount(res?.createLike?.listDto?.items?.[0]?.count);
          // setGetNewComments(Math.random());
        }
      })
      .catch((err) => {});
  };
  const handleReplayComment = (e: any) => {
    setCommentId(e.target.id);
    setReplayOpen(!replayOpen);
  };
  const BrElementCreator = () => <br />;
  const MentionElementCreator = (fullname: string, username: string, id: string) => (
    // eslint-disable-next-line
    <Link href={''}>
      <Typography
        variant="subtitle1"
        color={theme.palette.primary.main}
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
    // eslint-disable-next-line
    <Link href={''}>
      <Typography
        variant="subtitle1"
        color={theme.palette.primary.main}
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
    if (!data) return;
    let body = data.body;
    const mentions = body?.match(/╣(.*?)╠/g) || [];
    const tags = body?.match(/#(.*?)\s/g) || [];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TagElementCreator, data]);

  const profileRoute = useMemo(() => {
    if (data.userType === UserTypeEnum.Ngo) {
      if (data.isMine) return PATH_APP.profile.ngo.root;
      return PATH_APP.profile.ngo.root + '/view/' + data.userId;
    } else {
      if (data.userId === user?.id) return PATH_APP.profile.user.root;
      return PATH_APP.profile.user.root + '/view/' + data.userId;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.userId, user?.id]);

  return (
    <Grid item xs={isReplay ? 10 : 12}>
      <Grid container xs={12}>
        <Grid item xs={2} display="flex" justifyContent="center" sx={{ pt: 1 }}>
          <Link href={profileRoute} passHref>
            <Avatar
              src={data.userAvatarUrl}
              sx={{ cursor: 'pointer' }}
              variant={data?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
            />
          </Link>
        </Grid>
        <Grid item xs={10}>
          {hasMedia && data.body !== '' ? (
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: 200, mt: 1 }}>
              <Box>
                <Link href={profileRoute} passHref>
                  <Typography variant="subtitle1"> {data.userFullName}</Typography>
                </Link>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ mr: 1 }}>
                  <Typography variant="caption" sx={{ color: theme.palette.grey[500] }}>
                    {data.createDateTime}
                  </Typography>
                </Box>
                <IconButton
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{ padding: 0 }}
                >
                  <MoreHoriz sx={{ color: theme.palette.grey[500] }} />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {data.userId === user?.id ? (
                    <MenuItem onClick={() => setOpenPublishDialog(true)}>
                      {' '}
                      <Image src={DeleteIcon} height={15} width={15} alt="" /> Delete
                    </MenuItem>
                  ) : (
                    <MenuItem>
                      {' '}
                      <Image src={reportIcon} height={15} width={15} alt="" /> Report
                    </MenuItem>
                  )}
                </Menu>
                <PostConfrimDialog
                  setOpenPublishDialog={setOpenPublishDialog}
                  openPublishDialog={openPublishDialog}
                  CommentId={data.id}
                  setGetNewComments={setGetNewComments}
                  commentsCount={commentsCount}
                  setCommentsCount={setCommentsCount}
                  postType={postType}
                  postId={PostId}
                />
              </Box>
            </Box>
          ) : (
            <PostCommetsBlob>
              <Box>
                <Box>
                  <Link href={profileRoute} passHref>
                    <Typography variant="subtitle1"> {data.userFullName}</Typography>
                  </Link>
                </Box>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ mr: 1 }}>
                  <Typography variant="caption" sx={{ color: theme.palette.grey[500] }}>
                    {data.createDateTime}
                  </Typography>
                </Box>
                <IconButton
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{ padding: 0 }}
                >
                  <MoreHoriz sx={{ color: theme.palette.grey[500] }} />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {data.userId === user?.id ? (
                    <MenuItem onClick={() => setOpenPublishDialog(true)}>
                      {' '}
                      <Image src={DeleteIcon} height={15} width={15} alt="" /> Delete
                    </MenuItem>
                  ) : (
                    <MenuItem>
                      {' '}
                      <Image src={reportIcon} height={15} width={15} alt="" /> Report
                    </MenuItem>
                  )}
                </Menu>
                <PostConfrimDialog
                  setOpenPublishDialog={setOpenPublishDialog}
                  openPublishDialog={openPublishDialog}
                  CommentId={data.id}
                  setGetNewComments={setGetNewComments}
                  commentsCount={commentsCount}
                  setCommentsCount={setCommentsCount}
                  postType={postType}
                  postId={PostId}
                />
              </Box>
              <PostCommetsText>
                <Typography variant="body2">
                  <PostCommentDescription description={body} />
                </Typography>
              </PostCommetsText>
            </PostCommetsBlob>
          )}
          {hasMedia ? (
            <Box sx={{ mt: 1 }}>
              <img src={data.mediaUrl} style={{ width: 200, borderRadius: '8px' }} alt="" />
              <PostCommetsTextFooter>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.surface.onSurfaceVariant,
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <ReplayDiv onClick={handleReplayComment} id={data.id}>
                    Replay
                  </ReplayDiv>
                  <PostCommentsTextFooterDot>
                    <Image src="/icons/dot.svg" width={5} height={5} alt="" />
                  </PostCommentsTextFooterDot>
                  {likeLoading ? (
                    <IconButtonAction>
                      <CircularProgress size={7} />
                    </IconButtonAction>
                  ) : (
                    <LikeDiv onClick={LikeHandler} id={data}>
                      {liked || data.isLikedByUser ? <Box>Liked</Box> : <Box>Like</Box>}
                    </LikeDiv>
                  )}
                </Typography>
                {likeCount && Number.parseInt(likeCount) > 0 && (
                  <Typography variant="caption" sx={{ color: theme.palette.surface.onSurfaceVariant }}>
                    {likeLoading ? (
                      <IconButtonAction>
                        <CircularProgress size={7} />
                      </IconButtonAction>
                    ) : (
                      <PostCommentsLikeCounterContainer>
                        <PostCommentsLikeCounter
                          sx={{
                            backgroundColor:
                              liked || data.isLikedByUser ? theme.palette.primary.light : theme.palette.grey[100],
                          }}
                        >
                          <ThumbUpOutlined
                            sx={{
                              width: '0.8rem',
                              fill: liked || data.isLikedByUser ? theme.palette.primary.dark : theme.palette.grey[500],
                            }}
                          />
                        </PostCommentsLikeCounter>{' '}
                        {likeCount}
                      </PostCommentsLikeCounterContainer>
                    )}
                  </Typography>
                )}
              </PostCommetsTextFooter>
              {replayOpen && commentId === data.id && (
                <PostCommentInput
                  parentId={parentId ? parentId : null}
                  commentReplayId={commentId}
                  replay={isReplay ? true : false}
                  isComment={isReplay ? false : true}
                  postId={PostId}
                  setGetNewComments={setGetNewComments}
                  setReplayOpen={setReplayOpen}
                  postType={postType}
                  commentsCount={commentsCount}
                  setCommentsCount={setCommentsCount}
                />
              )}
            </Box>
          ) : (
            <Box>
              <PostCommetsTextFooter>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.surface.onSurfaceVariant,
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <ReplayDiv onClick={handleReplayComment} id={data.id}>
                    Replay
                  </ReplayDiv>
                  <PostCommentsTextFooterDot>
                    <Image src="/icons/dot.svg" width={5} height={5} alt="" />
                  </PostCommentsTextFooterDot>
                  {likeLoading ? (
                    <IconButtonAction>
                      <CircularProgress size={7} />
                    </IconButtonAction>
                  ) : (
                    <LikeDiv onClick={LikeHandler} id={data}>
                      {liked || data.isLikedByUser ? <Box>Liked</Box> : <Box>Like</Box>}
                    </LikeDiv>
                  )}
                </Typography>
                {likeCount && Number.parseInt(likeCount) > 0 && (
                  <Typography variant="caption" sx={{ color: theme.palette.surface.onSurfaceVariant }}>
                    {likeLoading ? (
                      <IconButtonAction>
                        <CircularProgress size={7} />
                      </IconButtonAction>
                    ) : (
                      <PostCommentsLikeCounterContainer>
                        <PostCommentsLikeCounter
                          sx={{
                            backgroundColor:
                              liked || data.isLikedByUser ? theme.palette.primary.light : theme.palette.grey[100],
                          }}
                        >
                          <ThumbUpOutlined
                            sx={{
                              width: '0.8rem',
                              fill: liked || data.isLikedByUser ? theme.palette.primary.dark : theme.palette.grey[500],
                            }}
                          />
                        </PostCommentsLikeCounter>{' '}
                        {likeCount}
                      </PostCommentsLikeCounterContainer>
                    )}
                  </Typography>
                )}
              </PostCommetsTextFooter>
              {replayOpen && commentId === data.id && (
                <PostCommentInput
                  replay={isReplay ? true : false}
                  isComment={isReplay ? false : true}
                  commentReplayId={commentId}
                  postId={PostId}
                  setGetNewComments={setGetNewComments}
                  setReplayOpen={setReplayOpen}
                  postType={postType}
                  commentsCount={commentsCount}
                  setCommentsCount={setCommentsCount}
                />
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default PostCommentBlob;
