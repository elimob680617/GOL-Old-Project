//mui
import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { getSearchedPeople, getSearchLoading } from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import PeopleNotFound from '../notFound/PeopleNotFound';
//component
import PeopleItem from '../people/PeopleItem';
import { HorizontalScrollerWithNoScroll } from '../SharedStyled';
import PeopleSkelton from '../skelton/PeopleSkelton';

function AllPeopleSearch() {
  const peoples = useSelector(getSearchedPeople);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          People
        </Typography>
        <Typography variant="button" color="info.main">
          <Link href={PATH_APP.search.people}>
            <a>See more</a>
          </Link>
        </Typography>
      </Stack>
      <HorizontalScrollerWithNoScroll sx={{ display: 'flex' }} spacing={3}>
        {peoples.map((people, index) => (
          <Box className="item" key={people.id} sx={{ display: 'inline-block' }}>
            <PeopleItem index={index} people={people} />
          </Box>
        ))}

        {peoples.length === 0 && loading && (
          <>
            {[...Array(10)].map((i, index) => (
              <Box className="item" key={`people-skelton-${index}`} sx={{ display: 'inline-block' }}>
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
      </HorizontalScrollerWithNoScroll>
    </Stack>
  );
}

export default AllPeopleSearch;
