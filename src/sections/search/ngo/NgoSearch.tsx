import { Box, Stack, styled } from '@mui/material';
import React, { FC } from 'react';
import { getSearchCount, getSearchedNgo, getSearchLoading } from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import NgoNotFound from '../notFound/NgoNotFound';
import SearchSeeMore from '../SeeMore';
import NgoSkelton from '../skelton/NgoSkelton';
import NgoItem from './NgoItem';

const ReloadButtonStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}));

const NgoSearch: FC<{ nextPage }> = ({ nextPage }) => {
  const ngos = useSelector(getSearchedNgo);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <>
      {ngos.map((ngo, index) => (
        <NgoItem index={index} key={ngo.id} ngo={ngo} />
      ))}

      {ngos.length === 0 && loading && (
        <>
          {[...Array(15)].map((i) => (
            <NgoSkelton key={`ngo-skelton-${i}`} />
          ))}
        </>
      )}

      {ngos.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <NgoNotFound />
        </Stack>
      )}

      {ngos.length > 0 && count > ngos.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}
    </>
  );
};

export default NgoSearch;
