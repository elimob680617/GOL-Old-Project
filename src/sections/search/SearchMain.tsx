//mui
import { Divider, styled, Container, Typography, Stack, Button } from '@mui/material';
import { useRouter } from 'next/router';
//...................................................................
import React, { useState, useEffect } from 'react';
import { IIndustry } from 'src/@types/categories';
import { ICollege } from 'src/@types/education';
import { IExperirnce } from 'src/@types/experience';
import { IPlace } from 'src/@types/location';
import { SearchCategoryEnumType } from 'src/@types/sections/serverTypes';
import { ISkil } from 'src/@types/skill';
import { ISearchedUser, ISearchNgoReponse } from 'src/@types/user';
import { localStorageKeys, SIZES } from 'src/config';
import {
  filterInitialState,
  getSearchedValues,
  IFilters,
  resetAllSearched,
  resetSearch,
  valuingSearchValues,
} from 'src/redux/slices/search';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import GoPremium from '../home/GoPremium';
import Helpers from '../home/Helpers';
import SearchBody from './SearchBody';
import SearchFilter from './SearchFilter';
import useSearch from './useSearch';

const HeaderMenuStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  zIndex: 2,
  padding: theme.spacing(2, 0),
  position: 'sticky',
  top: 64,
}));
const HeaderTypographyStyle = styled(Typography)<{ active: boolean }>(({ theme, active }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(1),
  minWidth: 'unset',
  ...(active && {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.neutral,
  }),
  // cursor: 'pointer',
}));

export type searchTabs =
  | 'All'
  | 'People'
  | 'Ngo'
  | 'Post'
  | 'Fundraising'
  | 'Companies'
  | 'Hashtags'
  | 'Groups'
  | 'Pages'
  | 'Media'
  | '';

function SearchMain() {
  const { query, push, replace } = useRouter();
  const dispatch = useDispatch();
  const [firstTime, setFirstTime] = useState<boolean>(true);
  const searchedValue = useSelector(getSearchedValues);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [canSendRequest, setCanSendRequest] = useState<boolean>(false);

  useSearch(query && query.index ? (query.index[0] as searchTabs) : null, pageIndex, searchedValue, canSendRequest);

  const nextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  useEffect(() => {
    if (!query.index || !query.index[0]) {
      replace({ pathname: PATH_APP.search.all, query: query }, undefined, {
        shallow: true,
      });
    }
  }, [query.index]);

  const isActiveTab = (tabName: searchTabs) =>
    query && query.index && query.index[0] && tabName === query.index[0] ? true : false;

  const tabChanged = (tabname: searchTabs) => {
    setCanSendRequest(false);
    setTimeout(() => {
      setCanSendRequest(true);
    }, 50);
    dispatch(resetSearch());
    dispatch(resetAllSearched());
    push(
      { pathname: `${PATH_APP.search.root}/${tabname}`, query: { search: JSON.stringify(valuingQuery()) } },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    if (firstTime) {
      setFirstTime(false);
      return;
    }
    dispatch(resetSearch());
  }, [query.index]);

  useEffect(() => {
    if (!firstTime) {
      setPageIndex(1);
      dispatch(resetAllSearched());
      localStorage.setItem(localStorageKeys.search, JSON.stringify(searchedValue));
      replace(
        { pathname: `${PATH_APP.search.root}/${query!.index![0]}`, query: { search: JSON.stringify(valuingQuery()) } },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [searchedValue]);

  useEffect(() => {
    if (query.search) {
      const searchObject = { ...filterInitialState };
      const search = JSON.parse(query.search as string);
      if (!localStorage.getItem(localStorageKeys.search)) return;
      const searchLocalStageValue = JSON.parse(localStorage.getItem(localStorageKeys.search)!) as IFilters;
      if (search.colleges) {
        const colleges = searchLocalStageValue.colleges.filter((college) =>
          search.colleges.some((i) => i === college.id)
        );
        searchObject.colleges = colleges as ICollege[];
      }
      if (search.peoples) {
        const peoples = searchLocalStageValue.peoples.filter((people) => search.peoples.some((i) => i === people.id));
        searchObject.peoples = peoples as ISearchedUser[];
      }
      if (search.companyWorkeds) {
        const companies = searchLocalStageValue.companyWorkeds.filter((company) =>
          search.companyWorkeds.some((i) => i === company.id)
        );
        searchObject.companyWorkeds = companies as IExperirnce[];
      }
      if (search.industries) {
        const industries = searchLocalStageValue.industries.filter((industry) =>
          search.industries.some((i) => i === industry.id)
        );
        searchObject.industries = industries as IIndustry[];
      }
      if (search.fundraisingCategory) {
        const fundraisingCategory = searchLocalStageValue.fundraisingCategory.filter((category) =>
          search.fundraisingCategory.some((i) => i === category)
        );
        searchObject.fundraisingCategory = fundraisingCategory as SearchCategoryEnumType[];
      }
      if (search.companySize) {
        searchObject.companySize = search.companySize;
      }
      if (search.ngoSize) {
        searchObject.ngoSize = search.ngoSize;
      }
      if (search.ngos) {
        const ngos = searchLocalStageValue.ngos.filter((ngo) => search.ngos.some((i) => i === ngo.id!));
        searchObject.ngos = ngos as ISearchNgoReponse[];
      }
      if (search.mediaCreationTime) {
        searchObject.mediaCreationTime = search.mediaCreationTime;
      }
      if (search.locations) {
        const locations = searchLocalStageValue.locations.filter((location) =>
          search.locations.some((i) => i === location.id)
        );
        searchObject.locations = locations as IPlace[];
      }
      if (searchedValue.postType) {
        searchObject.postType = searchedValue.postType;
      }
      if (search.skills) {
        const skills = searchLocalStageValue.skills.filter((skill) => search.skills.some((i) => i === skill.id));
        searchObject.skills = skills as ISkil[];
      }
      if (search.universities) {
        const universities = searchLocalStageValue.universities.filter((university) =>
          search.universities.some((i) => i === university.id)
        );
        searchObject.universities = universities as ICollege[];
      }
      if (search.fundraisingType) {
        searchObject.fundraisingType = search.fundraisingType;
      }
      if (search.sortBy) {
        searchObject.sortBy = search.sortBy;
      }
      if (search.skills) {
        const skills = searchLocalStageValue.skills.filter((skill) => search.skills.some((i) => i === skill.id));
        searchObject.skills = skills as ISkil[];
      }
      if (search.searchedText) {
        searchObject.searchedText = search.searchedText;
      }
      dispatch(valuingSearchValues(searchObject));
      setTimeout(() => {
        setCanSendRequest(true);
      }, 10);
    } else {
      setCanSendRequest(true);
    }
  }, []);

  const checkList = (list: any[]) => (list.length > 0 ? true : false);

  const valuingQuery = () => {
    const retuerned: any = {};
    if (checkList(searchedValue.universities)) {
      retuerned.universities = searchedValue.universities.map((i) => i.id);
    }
    if (checkList(searchedValue.skills)) {
      retuerned.skills = searchedValue.skills.map((i) => i.id);
    }
    if (checkList(searchedValue.peoples)) {
      retuerned.peoples = searchedValue.peoples.map((i) => i.id);
    }
    if (checkList(searchedValue.ngoSize)) {
      retuerned.ngoSize = searchedValue.ngoSize;
    }
    if (checkList(searchedValue.ngos)) {
      retuerned.ngos = searchedValue.ngos.map((i) => i.id);
    }
    if (checkList(searchedValue.colleges)) {
      retuerned.colleges = searchedValue.colleges.map((i) => i.id);
    }
    if (checkList(searchedValue.industries)) {
      retuerned.industries = searchedValue.industries.map((i) => i.id);
    }
    if (searchedValue.mediaCreationTime) {
      retuerned.mediaCreationTime = searchedValue.mediaCreationTime;
    }
    if (searchedValue.companySize) {
      retuerned.companySize = searchedValue.companySize;
    }
    if (checkList(searchedValue.companyWorkeds)) {
      retuerned.companyWorkeds = searchedValue.companyWorkeds.map((i) => i.id);
    }
    if (checkList(searchedValue.locations)) {
      retuerned.locations = searchedValue.locations.map((i) => i.id);
    }
    if (checkList(searchedValue.fundraisingCategory)) {
      retuerned.fundraisingCategory = searchedValue.fundraisingCategory;
    }
    if (checkList(searchedValue.ngos)) {
      retuerned.ngos = searchedValue.ngos;
    }
    if (searchedValue.fundraisingType) {
      retuerned.fundraisingType = searchedValue.fundraisingType;
    }
    if (searchedValue.postType) {
      retuerned.postType = searchedValue.postType;
    }
    if (searchedValue.sortBy) {
      retuerned.sortBy = searchedValue.sortBy;
    }
    if (searchedValue.searchedText) {
      retuerned.searchedText = searchedValue.searchedText;
    }
    return retuerned;
  };

  return (
    <>
      <Divider />
      <HeaderMenuStyle>
        <Container sx={{ p: '0px !important', height: '100%' }} maxWidth="lg">
          <Stack spacing={4} direction="row" alignItems="center" sx={{ height: '100%' }}>
            <HeaderTypographyStyle
              active={isActiveTab('All')}
              onClick={() => tabChanged('All')}
              as={Button}
              variant="subtitle1"
              id="All"
            >
              All
            </HeaderTypographyStyle>
            <HeaderTypographyStyle
              active={isActiveTab('People')}
              onClick={() => tabChanged('People')}
              as={Button}
              variant="subtitle1"
              id="People"
            >
              People
            </HeaderTypographyStyle>
            <HeaderTypographyStyle
              active={isActiveTab('Ngo')}
              onClick={() => tabChanged('Ngo')}
              as={Button}
              variant="subtitle1"
              id="Ngo"
            >
              NGOs
            </HeaderTypographyStyle>
            <HeaderTypographyStyle
              active={isActiveTab('Post')}
              as={Button}
              id="Post"
              variant="subtitle1"
              onClick={() => tabChanged('Post')}
            >
              Posts
            </HeaderTypographyStyle>
            <HeaderTypographyStyle
              active={isActiveTab('Fundraising')}
              as={Button}
              id="Fundraising"
              variant="subtitle1"
              onClick={() => tabChanged('Fundraising')}
            >
              Fundraising
            </HeaderTypographyStyle>
            <HeaderTypographyStyle
              active={isActiveTab('Hashtags')}
              onClick={() => tabChanged('Hashtags')}
              as={Button}
              variant="subtitle1"
              id="Hashtags"
            >
              Hashtags
            </HeaderTypographyStyle>
          </Stack>
        </Container>
      </HeaderMenuStyle>
      <Stack sx={{ m: '0 auto', my: 3, width: SIZES.lg }}>
        <Stack spacing={3} direction="row" sx={{ flex: 1 }}>
          {query.index && query.index[0] && query.index[0] !== 'All' && (
            <Stack spacing={4} sx={{ width: 264 }}>
              <SearchFilter searchType={query.index[0] as searchTabs} />
              <GoPremium />
              <Helpers />
            </Stack>
          )}

          {query.index && query.index[0] && (
            <SearchBody nextPage={nextPage} searchType={query.index[0] as searchTabs} />
          )}
        </Stack>
      </Stack>
    </>
  );
}

export default SearchMain;
