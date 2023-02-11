// @mui
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Audience, PostStatus, UserTypeEnum } from 'src/@types/sections/serverTypes';
import { MentionAndHashtag } from 'src/components/textEditor';
import useAuth from 'src/hooks/useAuth';
import { setNewPost, setUpdatePost } from 'src/redux/slices/homePage';
import {
  basicSharePostSelector,
  resetSharedPost,
  setSharedPostAudience,
  setSharedPostText,
} from 'src/redux/slices/post/sharePost';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { ERROR } from 'src/theme/palette';
import { useUpdateSocialPostMutation } from 'src/_requests/graphql/post/create-post/mutations/updateSocialPost.generated';
import { useLazyGetSocialPostQuery } from 'src/_requests/graphql/post/getSocialPost.generated';
import { useLazyGetFundRaisingPostQuery } from 'src/_requests/graphql/post/post-details/queries/getFundRaisingPost.generated';
import { useSharePostMutation } from 'src/_requests/graphql/post/share-post/mutations/sharePost.generated';
import ShareCampaignPostCard from './ShareCampaignPostCard';
import ShareSocialPostCard from './ShareSocialPostCard';
//icon
import { Icon } from 'src/components/Icon';

const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));
const UserFullNameStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  lineHeight: '22.5px',
  fontSize: '18px',
  color: theme.palette.grey[900],
}));
const SelectedLocationStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '17.5px',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  cursor: 'pointer',
}));
const ViewerButtonStyle = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 32,
  width: 'fit-content',
}));
const ViewrTextStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 14,
  lineHeight: '17.5px',
  color: theme.palette.grey[900],
}));

interface IPostRoute {
  routeType?: 'home' | 'postDetails';
}

function SharePostDialog(props: IPostRoute) {
  const { routeType } = props;
  const { user } = useAuth();
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const { push, replace } = useRouter();
  const [listOfRichs, setListOfRichs] = useState<any[]>([]);
  const [textLimitation, setTextLimitation] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [firstInitializeForUpdate, setFirstInitializeForUpdate] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const [sharePostRequest] = useSharePostMutation();
  const [updatePostRequest] = useUpdateSocialPostMutation();
  const postShared = useSelector(basicSharePostSelector);
  const [getSocialPost, { data: socialPostData, isFetching: getSocialPostFetching }] = useLazyGetSocialPostQuery();
  const socialPost = socialPostData?.getSocialPost?.listDto?.items?.[0];
  const [getFundRaisingPost, { data: campaignPostData, isFetching: getFundRaisingPostFetching }] =
    useLazyGetFundRaisingPostQuery();
  const campaignPost = campaignPostData?.getFundRaisingPost?.listDto?.items?.[0];
  const listOfTag: any[] = [];
  const listOfMention: any[] = [];
  let postSharedText = '';
  listOfRichs.map((item) => {
    item?.children?.map((obj: any) => {
      if (obj.type) {
        obj.type === 'tag' ? listOfTag.push(obj.id) : obj.type === 'mention' ? listOfMention.push(obj.id) : null;
      }
      obj.text
        ? (postSharedText += obj.text)
        : obj.type === 'tag'
        ? (postSharedText += `#${obj.title}`)
        : obj.type === 'mention'
        ? (postSharedText += `╣${obj.fullname}╠`)
        : (postSharedText += ' ');
    });
    if (listOfRichs.length > 1) {
      postSharedText += '\\n';
    }
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const audienceChanged = (audience: Audience) => {
    dispatch(setSharedPostAudience(audience));
    handleClose();
  };

  const audienctTypeToString = (audience: Audience) => {
    switch (audience) {
      // case Audience.Followers:
      //   return 'Followers';
      // case Audience.FollowersExcept:
      //   return 'Followers except';
      // case Audience.OnlyMe:
      //   return 'Only me';
      case Audience.Public:
        return 'Public';
      case Audience.Private:
        return 'Private';
      // case Audience.SpecificFollowers:
      //   return 'Specific Followers';
      default:
        return '';
    }
  };
  const onCloseShareDialog = () => {
    router.push(PATH_APP.home.index);
    // router.back();
    dispatch(resetSharedPost());
  };
  useLayoutEffect(() => {
    if (!postShared?.id) {
      router.back();
    }
  }, []);

  useEffect(() => {
    if (postShared?.id) {
      if (postShared?.sharedPostType == 'campaign') {
        getFundRaisingPost({
          filter: {
            dto: { id: postShared?.id },
          },
        });
      } else {
        getSocialPost({ filter: { dto: { id: postShared?.id } } });
      }
    }
  }, [getFundRaisingPost, getSocialPost, postShared?.id, postShared?.sharedPostType]);

  const convertSlateValueToText = () => {
    let text = '';
    postShared.text.map((item: any, index: number) => {
      item.children &&
        item?.children.map &&
        item.children.map((obj: any) => {
          if (obj.type) {
            obj.type === 'tag' ? listOfTag.push(obj.id) : obj.type === 'mention' ? listOfMention.push(obj.id) : null;
          }
          obj.text
            ? (text += obj.text)
            : obj.type === 'tag'
            ? (text += `#${obj.title} `)
            : obj.type === 'mention'
            ? (text += `╣${obj.fullname}╠`)
            : (text += '');
        });
      if (index + 1 !== postShared.text.length) text += ' \\n';
    });
    return text;
  };

  const sharePost = () => {
    sharePostRequest({
      socialPost: {
        dto: {
          audience: postShared.audience,
          id: postShared.id,
          body: convertSlateValueToText(),
          mentionedUserIds: listOfMention,
          tagIds: listOfTag,
          placeId: postShared.location && postShared.location.id ? postShared.location.id : '',
          status: PostStatus.Show,
          sharePostId: postShared.id,
        },
      },
    })
      .unwrap()
      .then((res) => {
        dispatch(setNewPost({ id: res?.sharePost?.listDto?.items?.[0]?.id as string, type: 'share' }));
        replace(PATH_APP.home.index, undefined, { shallow: true });
        dispatch(resetSharedPost());
      })
      .catch((err) => {
        toast.error(err.message);
        replace(PATH_APP.home.index);
        dispatch(resetSharedPost());
      });
  };

  const updateSharePost = () => {
    updatePostRequest({
      socialPost: {
        dto: {
          audience: postShared.audience,
          id: postShared.id,
          body: convertSlateValueToText(),
          placeId: postShared.location && postShared.location.id ? postShared.location.id : '',
          mentionedUserIds: [],
          tagIds: [],
          status: PostStatus.Show,
          sharePostId: postShared.sharePostId,
        },
      },
    })
      .unwrap()
      .then((res) => {
        dispatch(setUpdatePost({ id: res.updateSocialPost?.listDto?.items?.[0]?.id as string, type: 'share' }));
        replace(PATH_APP.home.index);
        dispatch(resetSharedPost());
      })
      .catch((err) => {
        toast.error(err.message);
        replace(PATH_APP.home.index);
        dispatch(resetSharedPost());
      });
  };

  useEffect(() => {
    if (postShared.editMode && !firstInitializeForUpdate) {
      setFirstInitializeForUpdate(true);
    }
  }, [firstInitializeForUpdate, postShared]);

  const sharePostOrupdateSharePost = () => {
    if (postShared?.editMode) {
      updateSharePost();
    } else {
      sharePost();
    }
  };

  return (
    <>
      <Dialog maxWidth="sm" fullWidth keepMounted open={true} onClose={onCloseShareDialog}>
        <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
          <HeaderWrapperStyle direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" color={theme.palette.text.primary}>
              Share
            </Typography>
            <IconButton onClick={onCloseShareDialog} sx={{ padding: 0 }}>
              <Icon name="Close" color="grey.500" type="linear" />
            </IconButton>
          </HeaderWrapperStyle>
        </DialogTitle>
        <DialogContent sx={{ maxHeight: 656 }}>
          <Stack spacing={2} direction="row" sx={{ mt: 2, mb: 2 }}>
            <Stack>
              <Avatar
                src={user?.avatarUrl || ''}
                sx={{ width: 48, height: 48 }}
                variant={user?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
              />
            </Stack>
            <Stack spacing={1}>
              <Stack spacing={1} direction="row">
                <UserFullNameStyle variant="h6">
                  {user?.firstName && user?.lastName ? user?.firstName + ' ' + user?.lastName : user?.fullName}
                </UserFullNameStyle>
                {postShared?.location && postShared?.location?.id && (
                  <Stack justifyContent="center">
                    <img src="/icons/dot.svg" width={5} height={5} alt="selected-location" />
                  </Stack>
                )}
                {postShared?.location && postShared?.location?.id && (
                  <Stack sx={{ flex: 1 }} spacing={0.5} direction="row" alignItems="center" flexWrap="nowrap">
                    <Box sx={{ minWidth: 16, minHeight: 16 }}>
                      <img src="/icons/location/location.svg" width={16} height={16} alt="selected-location" />
                    </Box>
                    {routeType === 'home' ? (
                      <SelectedLocationStyle
                        onClick={() => push(PATH_APP.post.sharePost.addLocation)}
                        variant="subtitle2"
                      >
                        {postShared?.location?.address}
                      </SelectedLocationStyle>
                    ) : (
                      <SelectedLocationStyle
                        onClick={() =>
                          push(
                            `${PATH_APP.post.postDetails.index}/${postShared?.id}/location/${postShared?.sharedPostType}`
                          )
                        }
                        variant="subtitle2"
                      >
                        {postShared?.location?.address}
                      </SelectedLocationStyle>
                    )}
                  </Stack>
                )}
              </Stack>
              <ViewerButtonStyle
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Stack justifyContent="center">
                    <img src="/icons/location/global.svg" width={20} height={20} alt="post-viewers" />
                  </Stack>
                  <ViewrTextStyle variant="body2">
                    {audienctTypeToString(postShared?.audience as Audience)}
                  </ViewrTextStyle>
                  <Stack justifyContent="center">
                    <img src="/icons/arrow/arrow-down.svg" width={20} height={20} alt="post-viewers" />
                  </Stack>
                </Stack>
              </ViewerButtonStyle>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={() => audienceChanged(Audience.Public)}>Public</MenuItem>
                <MenuItem onClick={() => audienceChanged(Audience.Private)}>Private</MenuItem>
                {/* <MenuItem onClick={() => audienceChanged(Audience.OnlyMe)}> Only me</MenuItem>
                <MenuItem onClick={() => audienceChanged(Audience.Followers)}>Followers</MenuItem>
                <MenuItem onClick={() => audienceChanged(Audience.SpecificFollowers)}>Specific Followers</MenuItem>
                <MenuItem onClick={() => audienceChanged(Audience.FollowersExcept)}>Followers except</MenuItem> */}
              </Menu>
            </Stack>
          </Stack>
          <Stack>
            <MentionAndHashtag
              setListOfRichs={setListOfRichs}
              eventType={'sharePost'}
              setTextLimitation={setTextLimitation}
              value={postShared.text}
              onChange={(value) => dispatch(setSharedPostText(value))}
            />
          </Stack>

          {postShared?.sharedPostType === 'campaign' || (postShared.editMode && socialPost?.isSharedCampaignPost) ? (
            getFundRaisingPostFetching || (postShared.editMode && getSocialPostFetching) ? (
              <Stack alignItems="center" justifyContent="center">
                <CircularProgress size={16} />
              </Stack>
            ) : (
              <ShareCampaignPostCard post={postShared.editMode ? socialPost : campaignPost} isShared />
            )
          ) : getSocialPostFetching ? (
            <Stack alignItems="center" justifyContent="center">
              <CircularProgress size={16} />
            </Stack>
          ) : (
            <ShareSocialPostCard post={socialPost} isShared />
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          {Number(textLimitation) >= 3001 ? (
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Stack alignItems={'center'} direction="row">
                <Icon name="Exclamation-Mark" color="error.main" type="solid" />
                <Typography variant="button" color={ERROR.main}>
                  Characters should be less than 3,000.
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <>
              {routeType === 'home' ? (
                <Link href={PATH_APP.post.sharePost.addLocation} shallow passHref>
                  <IconButton sx={{ p: 0 }}>
                    <Icon name="location" color="grey.900" type="linear" />
                  </IconButton>
                </Link>
              ) : (
                <Link
                  href={`${PATH_APP.post.postDetails.index}/${postShared?.id}/location/${postShared?.sharedPostType}`}
                  shallow
                  passHref
                >
                  <IconButton sx={{ p: 0 }}>
                    <Icon name="location" color="grey.900" type="linear" />
                  </IconButton>
                </Link>
              )}

              <Button
                onClick={sharePostOrupdateSharePost}
                variant="contained"
                sx={{ width: 120 }}
                disabled={Number(textLimitation) >= 3001}
              >
                {postShared.editMode ? 'Edit' : 'Share'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SharePostDialog;
