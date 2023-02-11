import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MessageText1 } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FC, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { EntityType } from 'src/@types/sections/serverTypes';
import { setSendPostId, setSendPostType } from 'src/redux/slices/post/sendPost';
import { setSharedPostId, setSharedPostType } from 'src/redux/slices/post/sharePost';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useCreateLikeMutation } from 'src/_requests/graphql/postbehavior/mutations/createLike.generated';
//icon
import { Icon } from 'src/components/Icon';

interface IPostAction {
  like?: string;
  postType?: 'campaign' | 'social';
  comment: string;
  share: string;
  view: string;
  setCommentOpen?: any;
  commentOpen?: any;
  id: string;
  isLikedByUser?: any;
  likeChanged?: (status: boolean) => void;
  countLikeChanged?: (status: any) => void;
  inDetails?: boolean;
  sharedSocialPost?: any;
  sharedCampaignPost?: any;
  shareRouteType?: 'home' | 'postDetails';
  sendRouteType?: 'home' | 'postDetails';
  commentsCount?: string | null | undefined;
}

const ActiontextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
const IconButtonAction = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const PostActions: FC<IPostAction> = ({
  shareRouteType = 'home',
  sendRouteType = 'home',
  inDetails = false,
  like,
  comment,
  share,
  view,
  setCommentOpen,
  commentOpen,
  likeChanged,
  id,
  isLikedByUser,
  countLikeChanged,
  postType,
  sharedSocialPost,
  sharedCampaignPost,
  commentsCount,
}) => {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const [createLikeMutation] = useCreateLikeMutation();
  const [countLike, setCountLike] = useState(Number(like));
  const [isLike, setIsLike] = useState(isLikedByUser);
  const [copied, setCopied] = useState(false);

  const createLike = () => {
    createLikeMutation({
      like: {
        dto: {
          entityType: EntityType.Post,
          entityId: id,
        },
      },
    });
  };

  function likeHandler() {
    if (isLike) {
      setIsLike(false);
      setCountLike(countLike - 1);
    } else {
      setIsLike(true);
      setCountLike(countLike + 1);
    }
  }

  const open = Boolean(anchorEl);
  const shareHandleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const shareHandleClose = () => {
    setAnchorEl(null);
  };
  const onCopy = () => {
    setCopied(true);

    enqueueSnackbar('Copied!');
    shareHandleClose();
  };
  const handleSharePost = () => {
    dispatch(setSharedPostId(id));
    dispatch(setSharedPostType(postType || 'social'));
    if (shareRouteType === 'home') {
      push(`${PATH_APP.post.sharePost.index}/${id}/share/${postType}`);
    } else {
      push(`${PATH_APP.post.postDetails.index}/${id}/share/${postType}`);
    }
    shareHandleClose();
  };

  const handleSharedCampaignPost = () => {
    dispatch(setSharedPostId(sharedCampaignPost?.id));
    dispatch(setSharedPostType('campaign'));
    push(PATH_APP.post.sharePost.index);
    shareHandleClose();
  };

  const handleSharedSocialPost = () => {
    dispatch(setSharedPostId(sharedSocialPost?.id));
    dispatch(setSharedPostType('social'));
    push(PATH_APP.post.sharePost.index);
    shareHandleClose();
  };

  const handleSentCampaignPost = () => {
    dispatch(setSendPostId(id));
    dispatch(setSendPostType('social'));
    if (sendRouteType === 'home') {
      push(`${PATH_APP.post.sendPost.index}/${id}/send/${postType}`);
    } else {
      push(`${PATH_APP.post.postDetails.index}/${id}/send/${postType}`);
    }
    shareHandleClose();
  };
  const handleSentPost = () => {
    dispatch(setSendPostId(id));
    dispatch(setSendPostType(postType || ''));

    if (sendRouteType === 'home') {
      push(`${PATH_APP.post.sendPost.index}/${id}/send/${postType}`);
    } else {
      push(`${PATH_APP.post.postDetails.index}/${id}/send/${postType}`);
    }
    shareHandleClose();
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" alignItems="center">
        <IconButtonAction
          sx={{ p: 0.5 }}
          onClick={() => {
            createLike();
            likeChanged!(!isLikedByUser);
            likeHandler();
            countLikeChanged!(like || 0);
          }}
        >
          {isLikedByUser ? (
            <Icon name="heart" type="solid" color="error.main" />
          ) : (
            <Icon name="heart" type="linear" color="grey.500" />
          )}
        </IconButtonAction>

        {inDetails ? (
          <ActiontextStyle variant="body2">{countLike ? countLike : like}</ActiontextStyle>
        ) : (
          <ActiontextStyle variant="body2">{countLike}</ActiontextStyle>
        )}
      </Stack>

      <Box onClick={() => setCommentOpen(!commentOpen)}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButtonAction sx={{ p: 0.5 }}>
            <MessageText1 size={20} />
          </IconButtonAction>
          <ActiontextStyle variant="body2">{commentsCount ? commentsCount : comment}</ActiontextStyle>
        </Stack>
      </Box>

      <Stack direction="row" alignItems="center">
        <IconButtonAction
          sx={{ p: 0.5 }}
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={shareHandleClick}
        >
          <Icon name="Reshare" type="linear" color="grey.500" />
        </IconButtonAction>
        <ActiontextStyle variant="body2">{share}</ActiontextStyle>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={shareHandleClose}
          PaperProps={{
            style: {
              width: '200px',
            },
          }}
        >
          {/* <MenuItem sx={{gap: 1}} onClick={() => push(`/share-post/?postId=${id}&postType=${postType}`)}> */}

          <MenuItem
            sx={{ gap: 1, my: 1 }}
            onClick={
              sharedSocialPost
                ? handleSharedSocialPost
                : sharedCampaignPost
                ? handleSharedCampaignPost
                : handleSharePost
            }
          >
            <Icon name="Reshare" type="linear" color="grey.500" />
            <Typography variant="body2" color="text.primary">
              Share
            </Typography>
          </MenuItem>

          <MenuItem sx={{ gap: 1, my: 1 }} onClick={sharedCampaignPost ? handleSentCampaignPost : handleSentPost}>
            <Icon name="Send" type="linear" color="grey.500" />
            <Typography variant="body2" color="text.primary">
              Send in Chat
            </Typography>
          </MenuItem>

          <CopyToClipboard text={`https://dev.aws.gardenoflove.co/post/post-details/${id}`} onCopy={onCopy}>
            <MenuItem sx={{ gap: 1, width: '100%', my: 1 }}>
              <Icon name="Link" type="solid" color="grey.500" />
              <Typography variant="body2" color="text.primary">
                Copy link
              </Typography>
            </MenuItem>
          </CopyToClipboard>
        </Menu>
      </Stack>

      <Stack direction="row" alignItems="center">
        <IconButtonAction sx={{ p: 0.5 }}>
          <Icon name="Eye" type="linear" color="grey.500" />
        </IconButtonAction>
        <ActiontextStyle variant="body2">{view}</ActiontextStyle>
      </Stack>
    </Stack>
  );
};

export default PostActions;
