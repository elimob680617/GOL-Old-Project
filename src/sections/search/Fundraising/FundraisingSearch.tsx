import { Box, Stack } from '@mui/material';
import React, { FC } from 'react';
import { getSearchCount, getSearchedCampaginPost, getSearchLoading } from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import PostNotFound from '../notFound/PostNotFound';
import SearchSeeMore from '../SeeMore';
import FundrasingPostSkelton from '../skelton/FundrasingPostSkelton';
import FundraisingItem from './FundraisingItem';

const FundraisingSearch: FC<{ nextPage }> = ({ nextPage }) => {
  const posts = useSelector(getSearchedCampaginPost);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <Stack sx={{ maxWidth: 800, margin: '0 auto!important', borderRadius: 1 }} spacing={2} alignItems="center">
      {posts.map((post, index) => (
        <Box key={index} sx={{ maxWidth: '30rem' }}>
          <FundraisingItem post={post} />
        </Box>
      ))}

      {posts.length === 0 && loading && (
        <Stack flexWrap="wrap">
          {[...Array(5)].map((i, index) => (
            <Box key={index} sx={{ width: '30rem' }}>
              <FundrasingPostSkelton key={`campagin-post-${index}`} />
            </Box>
          ))}
        </Stack>
      )}

      {posts.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <PostNotFound />
        </Stack>
      )}

      {posts.length > 0 && count > posts.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}
    </Stack>
  );
};

export default FundraisingSearch;
