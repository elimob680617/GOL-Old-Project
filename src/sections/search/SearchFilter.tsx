import { FC } from 'react';
import FundraisingFilter from './Fundraising/FundraisingFilter';
import NgoFilter from './ngo/NgoFilter';
import PeopleSidebar from './people/PeopleSidebar';
import PostFilter from './post/PostFilter';
import { searchTabs } from './SearchMain';

const SearchFilter: FC<{ searchType: searchTabs }> = ({ searchType }) => {
  const searchedFilters = {
    Fundraising: <FundraisingFilter />,
    Ngo: <NgoFilter />,
    People: <PeopleSidebar />,
    Post: <PostFilter />,
  };

  const conditionalRendering = (type: searchTabs) => searchedFilters[type];

  return <>{conditionalRendering(searchType)}</>;
};

export default SearchFilter;
