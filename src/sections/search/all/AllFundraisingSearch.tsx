import { Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { getSearchedCampaginPost, getSearchLoading } from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import FundraisingItem from '../Fundraising/FundraisingItem';
import FundrasingNotFound from '../notFound/FundraisingNotFound';
import { PostWrapperStyle } from '../SharedStyled';
import FundrasingPostSkelton from '../skelton/FundrasingPostSkelton';

function AllFundrasingSearch() {
  const posts = useSelector(getSearchedCampaginPost);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          Fundraising
        </Typography>
        <Typography variant="button" color="info.main">
          <Link href={PATH_APP.search.fundraising}>
            <a>See more</a>
          </Link>
        </Typography>
      </Stack>
      <PostWrapperStyle spacing={2}>
        {posts.map((post, index) => (
          <FundraisingItem key={post.id} post={post} />
        ))}

        {posts.length === 0 && loading && (
          <>
            {[...Array(2)].map((i, index) => (
              <FundrasingPostSkelton key={`fundrasing-post-skelton-${index}`} />
            ))}
          </>
        )}

        {posts.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <FundrasingNotFound />
          </Stack>
        )}
      </PostWrapperStyle>
    </Stack>
  );
}

export default AllFundrasingSearch;
