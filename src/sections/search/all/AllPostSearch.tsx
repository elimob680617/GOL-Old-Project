import { Stack, Typography } from '@mui/material';

import Link from 'next/link';

import { getSearchedSocialPosts, getSearchLoading } from 'src/redux/slices/search';

import { useSelector } from 'src/redux/store';

import { PATH_APP } from 'src/routes/paths';

import SocialPost from 'src/sections/post/socialPost/SocialPostCard/socialPost';

import PostNotFound from '../notFound/PostNotFound';

import PostItem from '../post/PostItem';

import { PostWrapperStyle } from '../SharedStyled';

import PostSkelton from '../skelton/PostSkelton';

function AllPostSearch() {
  const posts = useSelector(getSearchedSocialPosts);

  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          Posts
        </Typography>

        <Typography variant="button" color="info.main">
          <Link href={PATH_APP.search.post}>
            <a>See more</a>
          </Link>
        </Typography>
      </Stack>

      <PostWrapperStyle>
        <Stack spacing={2}>
          {posts.map((post, index) => (
            <SocialPost page="search" key={post.id} post={post} />
          ))}

          {posts.length === 0 && loading && (
            <>
              {[...Array(2)].map((i, index) => (
                <PostSkelton key={`post-skelton-${index}`} />
              ))}
            </>
          )}

          {posts.length === 0 && !loading && (
            <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
              <PostNotFound />
            </Stack>
          )}
        </Stack>
      </PostWrapperStyle>
    </Stack>
  );
}

export default AllPostSearch;
