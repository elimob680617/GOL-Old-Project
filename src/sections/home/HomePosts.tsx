// @mui

// sections

import { Avatar, Card, Divider, Stack, Typography } from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';

import { styled } from '@mui/material/styles';

import { Router, useRouter } from 'next/router';

import { FC, useEffect, useMemo, useRef, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroller';

import { ICampaign, IPost, ISocial } from 'src/@types/post';

import GifDialog from 'src/components/Gif';

import useAuth from 'src/hooks/useAuth';

import {
  addToHomePageUpdatePost,
  deleteFromHomePagePost,
  getHomeDeletedPost,
  getHomeNewAddedPost,
  getHomeScroll,
  getHomeUpdatedPost,
  getPosts,
  getPostsCount,
  insertPosts,
  setHomeScroll,
  setNewPost,
  valuingHomePostCount,
} from 'src/redux/slices/homePage';

import { reset } from 'src/redux/slices/post/createSocialPost';

import { reset as resetUpload } from 'src/redux/slices/upload';

import { useDispatch, useSelector } from 'src/redux/store';

import { PATH_APP } from 'src/routes/paths';

import Wizard from 'src/sections/profile/user/wizard/Wizard';

import { useLazyGetFundRaisingPostForEditQuery } from 'src/_requests/graphql/post/campaign-post/queries/getCampaignPostForEdit.generated';

import { useLazyGetSocialPostQuery } from 'src/_requests/graphql/post/getSocialPost.generated';

import { useLazyGetHomePagePostsQuery } from 'src/_requests/graphql/post/queries/getHomePagePosts.generated';

import CampignPost from '../post/campaignPost/campignPostCard/CampignPost';

import SendPostInChatDialog from '../post/sharePost/sendPost/SendPostChatDialog';

import SendToConnectionsDialog from '../post/sharePost/sendPost/SendToConnectionsDialog';

import ShareCampaignPostCard from '../post/sharePost/ShareCampaignPostCard';

import SharePostAddLocationDialog from '../post/sharePost/SharePostAddLocationDialog';

import SharePostDialog from '../post/sharePost/SharePostDialog';

import ShareSocialPostCard from '../post/sharePost/ShareSocialPostCard';

import SocialPostAddLocationDialog from '../post/socialPost/createSocialPost/SocialPostAddLocationDialog';

import SocialPostCreateDialog from '../post/socialPost/createSocialPost/SocialPostCreateDialog';

import MediaDialog from '../post/socialPost/MediaDialog/MediaDialog';

import SocialPost from '../post/socialPost/SocialPostCard/socialPost';

import NgoWizard from 'src/sections/profile/ngo/wizard/Wizard';

import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import UrgentCampaign from './UrgentCampaign';
import { useDeleteFundRaisingPostMutation } from 'src/_requests/graphql/post/campaign-post/mutations/deletePost.generated';

const CreatePostWrapperStyle = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ClickableStyle = styled(Stack)(({ theme }) => ({
  cursor: 'pointer',
}));

const CreatePostButton = styled(Stack)(({ theme }) => ({
  cursor: 'pointer',
}));

const CreatePostButtonText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const HomePosts: FC = () => {
  const { user } = useAuth();

  const pageSector = () => {
    switch (query?.index?.[0] as string) {
      case 'home':
        return null;

      case 'create-social-post':
        return <SocialPostCreateDialog />;

      case 'add-social-post-location':
        return <SocialPostAddLocationDialog />;

      case 'add-gif':
        return <GifDialog />;

      case 'more-media':
        return <MediaDialog />;

      case 'share-post':
        return <SharePostDialog routeType={'home'} />;

      case 'add-share-location':
        return <SharePostAddLocationDialog />;

      case 'send-post':
        return <SendPostInChatDialog routeType={'home'} />;

      case 'send-to-connections':
        return <SendToConnectionsDialog />;

      default:
        return null;
    }
  };

  const { query, push } = useRouter();

  const dispatch = useDispatch();

  const [getHomePagePosts, { isLoading: getPostsLoading, data: postsResponse, isFetching: getPostFetching }] =
    useLazyGetHomePagePostsQuery();

  const [hasMorePosts, setHasmorePosts] = useState<boolean>(false);

  const pageSize = 20;

  const pageIndex = useRef<number>(0);

  const posts = useSelector(getPosts);

  const newPost = useSelector(getHomeNewAddedPost);

  const updatePost = useSelector(getHomeUpdatedPost);

  const deletePost = useSelector(getHomeDeletedPost);

  const postCount = useSelector(getPostsCount);

  const homePageScroll = useSelector(getHomeScroll);

  const [getSocialPost] = useLazyGetSocialPostQuery();

  const [getCampaignPost] = useLazyGetFundRaisingPostForEditQuery();

  const [removeCampaignPost] = useDeleteFundRaisingPostMutation();

  useEffect(() => {
    if (query.index && query.index[0] === 'home') {
      dispatch(reset());

      dispatch(resetUpload());
    }
  }, [query]);

  const valuingHasMorePosts = () => {
    if (postCount === null) return;

    if (postCount < (pageIndex.current + 1) * pageSize) {
      setHasmorePosts(false);
    } else {
      setHasmorePosts(true);
    }
  };

  useEffect(() => {
    if (posts === null) {
      pageIndex.current = 0;

      getHomePagePosts({ filter: { pageIndex: pageIndex.current, pageSize: pageSize } });
    } else {
      const outOfBind = posts.length % pageSize;

      const division = posts.length / pageSize;

      if (outOfBind === 0) {
        pageIndex.current = division - 1;
      } else {
        pageIndex.current = Math.floor(division);
      }
    }
  }, [posts]);

  const addToHomePageNewPost = (newPost: IPost) => {
    dispatch(insertPosts([newPost, ...(posts || [])]));

    dispatch(setNewPost(null));

    dispatch(valuingHomePostCount(postsResponse?.getHomePagePosts?.listDto?.count || 0));
  };

  useEffect(() => {
    if (!newPost) return;

    if (newPost.type === 'social') {
      getSocialPost({ filter: { dto: { id: newPost.id } } })
        .unwrap()

        .then((res) => {
          addToHomePageNewPost({ social: res?.getSocialPost?.listDto?.items?.[0] as ISocial });
        });
    }

    if (newPost.type === 'campaign') {
      getCampaignPost({ filter: { dto: { id: newPost.id } } })
        .unwrap()

        .then((res) => {
          addToHomePageNewPost({ campaign: res?.getFundRaisingPost?.listDto?.items?.[0] as ICampaign });
        });
    }

    if (newPost.type === 'share') {
      getSocialPost({ filter: { dto: { id: newPost.id } } })
        .unwrap()

        .then((res) => {
          addToHomePageNewPost({ social: res?.getSocialPost?.listDto?.items?.[0] as ISocial });
        });
    }
  }, [newPost]);

  useEffect(() => {
    if (!updatePost) return;
    if (updatePost.type === 'social') {
      getSocialPost({ filter: { dto: { id: updatePost.id } } })
        .unwrap()

        .then((res) => {
          dispatch(
            addToHomePageUpdatePost({
              type: 'social',

              post: { social: res?.getSocialPost?.listDto?.items?.[0] } as IPost,
            })
          );
        });
    }

    if (updatePost.type === 'campaign') {
      getCampaignPost({ filter: { dto: { id: updatePost.id } } })
        .unwrap()

        .then((res) => {
          dispatch(
            addToHomePageUpdatePost({
              type: 'campaign',

              post: { campaign: res?.getFundRaisingPost?.listDto?.items?.[0] } as IPost,
            })
          );
        });
    }

    if (updatePost.type === 'share') {
      getSocialPost({ filter: { dto: { id: updatePost.id } } })
        .unwrap()

        .then((res) => {
          dispatch(
            addToHomePageUpdatePost({
              type: 'social',

              post: { social: res?.getSocialPost?.listDto?.items?.[0] } as IPost,
            })
          );
        });
    }
  }, [updatePost]);

  useEffect(() => {
    if (!deletePost) return;
    console.log('deletePost', deletePost);
    if (deletePost.type === 'social') {
      getSocialPost({ filter: { dto: { id: deletePost.id } } })
        .unwrap()
        .then((res) => {
          dispatch(
            deleteFromHomePagePost({
              type: 'social',
              post: { social: res?.getSocialPost?.listDto?.items?.[0] } as IPost,
            })
          );
        });
    }

    if (deletePost.type === 'campaign') {
      removeCampaignPost({ fundRaisingPost: { dto: { id: deletePost.id } } })
        .unwrap()
        .then((res) => {
          dispatch(
            deleteFromHomePagePost({
              type: 'campaign',
              post: { campaign: res?.deleteFundRaisingPost?.listDto?.items?.[0] } as IPost,
            })
          );
        });
    }

    if (deletePost.type === 'share') {
      getSocialPost({ filter: { dto: { id: deletePost.id } } })
        .unwrap()
        .then((res) => {
          dispatch(
            deleteFromHomePagePost({
              type: 'social',
              post: { social: res?.getSocialPost?.listDto?.items?.[0] } as IPost,
            })
          );
        });
    }
  }, [deletePost]);

  useEffect(() => {
    valuingHasMorePosts();
  }, [postCount]);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const loadMore = () => {
    if (getPostFetching) return;

    pageIndex.current = pageIndex.current + 1;

    getHomePagePosts({ filter: { pageIndex: pageIndex.current, pageSize: pageSize } })
      .unwrap()

      .then((res) => {
        if (res?.getHomePagePosts?.listDto?.count < (pageIndex.current + 1) * pageSize) {
          setHasmorePosts(false);
        }
      })

      .catch(() => {});
  };

  useEffect(() => {
    if (postsResponse) {
      const newPosts = [...(posts || []), ...(postsResponse?.getHomePagePosts?.listDto?.items || [])];

      dispatch(insertPosts(newPosts as IPost[]));

      dispatch(valuingHomePostCount(postsResponse?.getHomePagePosts?.listDto?.count || 0));
    }
  }, [postsResponse]);

  useEffect(() => {
    changeScroll();
  }, []);

  const handler = (route: string) => {
    dispatch(setHomeScroll(window.scrollY));
  };

  useEffect(() => {
    Router.events.on('beforeHistoryChange', handler);

    return () => {
      Router.events.off('beforeHistoryChange', handler);
    };
  }, []);

  const changeScroll = () => {
    if (!homePageScroll) return;

    window.scrollTo({ top: homePageScroll, behavior: 'smooth' });
  };

  const renderSocialPostsMemo = useMemo(
    () => (
      <Stack spacing={2} sx={{ flex: 1, maxWidth: 480 }}>
        <CreatePostWrapperStyle>
          <Stack spacing={2}>
            <Stack
              spacing={2}
              direction="row"
              alignItems="center"
              onClick={() => push(PATH_APP.post.createPost.socialPost.index)}
              sx={{ cursor: 'pointer' }}
            >
              <Avatar
                src={user?.avatarUrl || ''}
                variant={user?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
                sx={{ width: 48, height: 48 }}
              />

              <ClickableStyle
                onClick={() => push(PATH_APP.post.createPost.socialPost.index, undefined, { shallow: true })}
              >
                <Typography variant="h6" sx={{ color: 'surface.onSurfaceVariantL' }}>
                  What’s going on?
                </Typography>
              </ClickableStyle>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <CreatePostButton
                alignItems="center"
                spacing={0.75}
                direction="row"
                onClick={() => push(PATH_APP.post.createPost.socialPost.index)}
              >
                <img src="/icons/image/24/Outline.svg" width={24} height={24} alt="image-icon" />

                <CreatePostButtonText variant="caption">Photo</CreatePostButtonText>
              </CreatePostButton>

              <CreatePostButton alignItems="center" spacing={0.75} direction="row">
                <img
                  src="/icons/video/24/Outline.svg"
                  width={24}
                  height={24}
                  onClick={() => push(PATH_APP.post.createPost.socialPost.index)}
                  alt="video-icon"
                />

                <CreatePostButtonText variant="caption">Video</CreatePostButtonText>
              </CreatePostButton>

              {user?.organizationUserType === 'NGO' && (
                <CreatePostButton
                  onClick={() => push(PATH_APP.post.createPost.campainPost.new)}
                  alignItems="center"
                  spacing={0.75}
                  direction="row"
                >
                  <img src="/icons/card/24/Outline.svg" width={24} height={24} alt="card-icon" />

                  <CreatePostButtonText variant="caption">Campaign</CreatePostButtonText>
                </CreatePostButton>
              )}

              <CreatePostButton alignItems="center" spacing={0.75} direction="row">
                <img src="/icons/article/24/Outline.svg" width={24} height={24} alt="article-icon" />

                <CreatePostButtonText variant="caption">Article</CreatePostButtonText>
              </CreatePostButton>
            </Stack>
          </Stack>
        </CreatePostWrapperStyle>

        <UrgentCampaign />

        {user?.userType === UserTypeEnum.Normal ? (
          <Wizard percentage={user?.completeProfilePercentage} fromHomePage={true} />
        ) : user?.userType === UserTypeEnum.Ngo ? (
          <NgoWizard percentage={user?.completeProfilePercentage} fromHomePage={true} />
        ) : (
          <></>
        )}

        {getPostsLoading && !posts ? (
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
          <InfiniteScroll
            loadMore={loadMore}
            hasMore={hasMorePosts}
            loader={
              <Stack sx={{ marginTop: 1, marginBottom: 1 }} direction="row" justifyContent="center">
                <CircularProgress />
              </Stack>
            }
          >
            <Stack spacing={2} sx={{ flex: 1 }}>
              {posts?.map((post) => {
                if (post?.social?.isSharedSocialPost)
                  return <ShareSocialPostCard key={post!.social?.id} post={post?.social} />;
                else if (post?.social?.isSharedCampaignPost)
                  return <ShareCampaignPostCard key={post!.social?.id} post={post?.social} />;
                else if (post?.social) return <SocialPost page="home" key={post!.social?.id} post={post?.social} />;

                return <CampignPost key={post!.campaign?.id} post={post?.campaign} />;
              })}
            </Stack>
          </InfiniteScroll>
        )}
      </Stack>
    ),

    [
      getPostsLoading,

      hasMorePosts,

      loadMore,

      posts,

      push,

      user?.avatarUrl,

      user?.completeProfilePercentage,

      user?.organizationUserType,

      user?.userType,
    ]
  );

  const renderSector = useMemo(() => pageSector(), [query.index]);

  return (
    <>
      {renderSector}

      {renderSocialPostsMemo}
    </>
  );
};

export default HomePosts;
