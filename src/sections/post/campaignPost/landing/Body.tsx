import { Box, CircularProgress, Skeleton, Stack, Typography } from '@mui/material';

import { useRouter } from 'next/router';

import { useEffect, useRef, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroller';

import { Audience, PostStatus, UserTypeEnum } from 'src/@types/sections/serverTypes';

import { useLazyGetFundRaisingPostsQuery } from 'src/_requests/graphql/post/campaign-post/queries/getCampaignPosts.generated';

import CampignPost from '../campignPostCard/CampignPost';

import CreateCampaingBanner from './CreateCampaingBanner';

interface IPost {
  id: string;

  body?: string | null;

  title?: string | null;

  ownerUserId: string;

  audience?: Audience | null;

  status?: PostStatus | null;

  isDeleted?: boolean | null;

  placeId?: string | null;

  summary?: string | null;

  placeDescription?: string | null;

  target?: any | null;

  deadline?: any | null;

  coverImageUrl?: string | null;

  placeMainText?: string | null;

  placeSecondaryText?: string | null;

  isLikedByUser?: boolean | null;

  location?: string | null;

  tagIds?: Array<string> | null;

  category?: number | null;

  mentionedUserIds?: Array<string> | null;

  videoUrls?: Array<string | null> | null;

  pictureUrls?: Array<string | null> | null;

  createdDateTime?: string | null;

  firstName?: string | null;

  fullName?: string | null;

  lastName?: string | null;

  userName?: string | null;

  userAvatarUrl?: string | null;

  averageRate?: any | null;

  numberOfRates?: string | null;

  raisedMoney?: any | null;

  dayLeft?: number | null;

  numberOfDonations?: string | null;

  countOfComments?: string | null;

  countOfLikes?: string | null;

  countOfShared?: string | null;

  countOfViews?: string | null;

  userType?: UserTypeEnum | null;

  isMine?: boolean | null;

  postLikerUsers?: Array<{
    id?: string | null;

    avatarUrl?: string | null;

    cognitoUserId?: string | null;

    fullName?: string | null;

    userName?: string | null;
  } | null> | null;

  mentionedUsers?: Array<{
    id?: string | null;

    avatarUrl?: string | null;

    cognitoUserId?: string | null;

    fullName?: string | null;

    userName?: string | null;
  } | null> | null;

  tags?: Array<{ id?: string | null; title?: string | null } | null> | null;

  donors?: Array<{
    fullName?: string | null;

    subtitle?: string | null;

    avatarUrl?: string | null;

    donateDate?: string | null;
  } | null> | null;

  updatedDateTime?: string | null;
}

const pageSize = 5;

const pageStart = 0;

const Body = () => {
  const [posts, setPosts] = useState<IPost[]>([]);

  const [count, setCount] = useState<number>(0);

  const [getPosts, { data: postResponse, isFetching: getPostFetching, isSuccess }] = useLazyGetFundRaisingPostsQuery();

  const [hasMore, setHasMore] = useState<boolean>(false);

  const { query } = useRouter();

  const [category, setCategory] = useState<number | null>(null);

  const [pageIndex, setPageIndex] = useState<number>(pageStart);

  const sendRequest = async (page: number) => {
    const nowPage = page !== pageStart && page !== pageIndex + 1 ? pageIndex + 1 : page;

    setPageIndex(nowPage);

    await getPosts({
      filter: {
        pageIndex: nowPage,

        pageSize,

        orderByFields: ['countOfLikes', 'numberOfDonations', 'countOfComments', 'countOfShared', 'updatedDateTime'],

        orderByDescendings: [true, true, true, true, true],

        dto: { status: PostStatus.Show, ...(!!category && { category: category }) },
      },
    });
  };

  useEffect(() => {
    if (postResponse && isSuccess && !getPostFetching) {
      setPosts([...posts, ...((postResponse?.getHomePageFundRaisingPosts?.listDto?.items || []) as IPost[])]);

      setCount(postResponse?.getHomePageFundRaisingPosts?.listDto?.count);
    }
  }, [postResponse, isSuccess, getPostFetching]);

  useEffect(() => {
    if (posts.length < count && !getPostFetching) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
  }, [posts, getPostFetching]);

  useEffect(() => {
    if (!query.search) return;

    setPageIndex(pageStart);

    const queryObject = JSON.parse(query.search as string);

    setCategory(queryObject.category ?? null);
  }, [query]);

  useEffect(() => {
    if (query.search || category !== null) {
      setPosts([]);

      sendRequest(pageStart);
    } else if (!query.search) {
      setCategory(0);
    }
  }, [category]);

  return (
    <Stack sx={{ flex: 1 }} spacing={3}>
      <CreateCampaingBanner />

      <Box
        sx={{
          borderRadius: 1,

          bgcolor: 'common.white',

          p: posts.length > 0 ? 6 : 0,

          maxHeight: 'calc(100vh - 471px)',

          overflowY: 'auto',
        }}
        id="scrollableDiv"
      >
        {posts.length > 0 && (
          <InfiniteScroll
            pageStart={0}
            loadMore={(p) => {
              if (!getPostFetching) {
                sendRequest(p);
              }
            }}
            hasMore={hasMore}
            useWindow={false}
          >
            {posts.map((post) => (
              <CampignPost key={post.id} post={post} />
            ))}
          </InfiniteScroll>
        )}

        {getPostFetching && pageIndex === pageStart && (
          <Stack spacing={5.5} p={8}>
            <Skeleton variant="rectangular" width="100%" height={200} />

            <Skeleton variant="rectangular" width="100%" height={200} />

            <Skeleton variant="rectangular" width="100%" height={200} />

            <Skeleton variant="rectangular" width="100%" height={200} />

            <Skeleton variant="rectangular" width="100%" height={200} />
          </Stack>
        )}

        {getPostFetching && pageIndex !== pageStart && (
          <Stack sx={{ marginTop: 1, marginBottom: 1 }} direction="row" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default Body;
