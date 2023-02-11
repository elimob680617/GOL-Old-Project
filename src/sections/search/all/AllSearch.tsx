//mui
import { Stack, styled } from '@mui/material';
import AllFundrasingSearch from './AllFundraisingSearch';
import AllHashtagSearch from './AllHashtags';
import AllNgoSearch from './AllNgoSearch';
import AllPeopleSearch from './AllPeopleSearch';
import AllPostSearch from './AllPostSearch';

const ItemWrapper = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
}));

export default function AllSearch() {
  return (
    <>
      <Stack sx={{ width: '100%', borderRadius: 1 }} px={3} mb={2} spacing={2}>
        <ItemWrapper>
          <AllPeopleSearch />
        </ItemWrapper>
        <ItemWrapper>
          <AllNgoSearch />
        </ItemWrapper>
        <ItemWrapper>
          <AllPostSearch />
        </ItemWrapper>
        <ItemWrapper>
          <AllFundrasingSearch />
        </ItemWrapper>
        <ItemWrapper>
          <AllHashtagSearch />
        </ItemWrapper>
      </Stack>
    </>
  );
}
