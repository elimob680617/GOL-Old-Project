import { Box, Stack } from '@mui/material';
import React, { FC } from 'react';
import PeopleItem from './PeopleItem';
import PeopleSkelton from '../skelton/PeopleSkelton';
import { useSelector } from 'src/redux/store';
import { getSearchCount, getSearchedPeople, getSearchLoading } from 'src/redux/slices/search';
import SearchSeeMore from '../SeeMore';
import PeopleNotFound from '../notFound/PeopleNotFound';

const PeopleSearch: FC<{ nextPage }> = ({ nextPage }) => {
  const peoples = useSelector(getSearchedPeople);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <Stack gap="10px" direction="row" flexWrap="wrap">
      {peoples.map((people, index) => (
        <Box key={people.id} sx={{ width: 'calc(20% - 8px)' }}>
          <PeopleItem index={index} people={people} />
        </Box>
      ))}

      {peoples.length === 0 && loading && (
        <>
          {[...Array(25)].map((i, index) => (
            <Box key={`people-skelton-${index}`} sx={{ width: 'calc(20% - 8px)' }}>
              <PeopleSkelton />
            </Box>
          ))}
        </>
      )}

      {peoples.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <PeopleNotFound />
        </Stack>
      )}

      {peoples.length > 0 && count > peoples.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}
      <SearchSeeMore seeMore={() => nextPage()} loading={loading} />
    </Stack>
  );
};

export default PeopleSearch;
