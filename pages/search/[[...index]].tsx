import { Stack, styled } from '@mui/material';
import React from 'react';
import { HEADER } from 'src/config';
import Layout from 'src/layouts';
import SearchMain from '../../src/sections/search/SearchMain';

SearchMainPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

const RootStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  width: '100%',
  minHeight: `calc(100vh - ${HEADER.DASHBOARD_DESKTOP_HEIGHT}px)`,
}));

function SearchMainPage() {
  return (
    <RootStyle>
      <SearchMain />
    </RootStyle>
  );
}

export default SearchMainPage;
