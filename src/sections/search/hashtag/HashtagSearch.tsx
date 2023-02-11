import { Box, Stack, styled } from '@mui/material';
import React, { FC } from 'react';
import { getSearchCount, getSearchedHashtags, getSearchLoading } from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import HashtagNotFound from '../notFound/HashtagNotFound';
import SearchSeeMore from '../SeeMore';
import HashtagSkelton from '../skelton/HashtagSkelton';
import HashtagItem from './HashtagItem';

const ReloadButtonStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}));

const HashtagSearch: FC<{ nextPage }> = ({ nextPage }) => {
  const hashtags = useSelector(getSearchedHashtags);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <>
      {hashtags.map((hashtag, index) => (
        <HashtagItem name={hashtag.title! || ''} key={hashtag.id} />
      ))}

      {hashtags.length === 0 && loading && (
        <>
          {[...Array(15)].map((i) => (
            <HashtagSkelton key={`ngo-skelton-${i}`} />
          ))}
        </>
      )}

      {hashtags.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <HashtagNotFound />
        </Stack>
      )}

      {!loading && count > hashtags.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}
    </>
  );
};

export default HashtagSearch;
