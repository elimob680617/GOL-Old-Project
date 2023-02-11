import { Accordion, AccordionDetails, AccordionSummary, Divider, Stack, styled, Typography } from '@mui/material';
import React, { useState } from 'react';
import {
  addSearchPeople,
  getSearchedValues,
  removeSearchPeople,
  resetSearch,
  setSearchSor,
} from 'src/redux/slices/search';
import { useDispatch, useSelector } from 'src/redux/store';
import PeopleFilter from '../filters/PeopleFilter';
import { SearchBadgeStyle, SearchSidebarStyled } from '../SharedStyled';
import CreattionTimeSort from '../sorts/CreattionTimeSort';

const AccordionStyle = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none!important',
  '& .MuiButtonBase-root': {
    padding: 0,
    minHeight: 'unset!important',
  },
  '& .MuiAccordionSummary-content': {
    margin: `${theme.spacing(0)}!important`,
    minHeight: 'unset',
  },
  '&::before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `${theme.spacing(3, 0, 0, 0)}!important`,
  },
}));

const AccordionDetailsStyle = styled(AccordionDetails)(({ theme }) => ({
  padding: 0,
}));

const DividerStyle = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

type Expanded = 'Creation Time' | 'Posted by' | 'Company' | 'Post Type';

const ClearAllStyle = styled(Typography)(({ theme }) => ({}));
export default function PostFilter() {
  const dispatch = useDispatch();
  const [expandedFilter, setExpandedFilter] = useState<Expanded | null>(null);
  const handleExpandedChange = (panel: Expanded) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFilter(isExpanded ? panel : null);
  };
  const searchedValue = useSelector(getSearchedValues);

  return (
    <>
      <SearchSidebarStyled p={3} spacing={3}>
        <Stack alignItems="center" justifyContent="space-between" direction="row">
          <Typography variant="subtitle1" color="text.primary">
            Filters
          </Typography>
          <ClearAllStyle
            onClick={() => dispatch(resetSearch())}
            variant="button"
            sx={{ color: 'info.main', cursor: 'pointer' }}
          >
            Clear All
          </ClearAllStyle>
        </Stack>

        <AccordionStyle expanded={expandedFilter === 'Creation Time'} onChange={handleExpandedChange('Creation Time')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={!searchedValue.sortBy}>
              <Typography variant="body2" color="text.primary">
                Creation Time
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'Creation Time' && <DividerStyle />}
            <CreattionTimeSort
              creationTimeChanged={(sort) => dispatch(setSearchSor(sort))}
              creattionTime={searchedValue.sortBy}
            />
            {expandedFilter === 'Creation Time' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>
        <AccordionStyle expanded={expandedFilter === 'Posted by'} onChange={handleExpandedChange('Posted by')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={searchedValue.peoples.length === 0}>
              <Typography variant="body2" color="text.primary">
                Posted by
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'Posted by' && <DividerStyle />}
            <PeopleFilter
              selectedPeople={searchedValue.peoples}
              peopleRemoved={(people) => dispatch(removeSearchPeople(people))}
              peopleSelected={(people) => dispatch(addSearchPeople(people))}
            />
            {expandedFilter === 'Posted by' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>
        {/* <AccordionStyle expanded={expandedFilter === 'Company'} onChange={handleExpandedChange('Company')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={searchedValue.companyWorkeds.length === 0}>
              <Typography variant="body2" color="text.primary">
                Company
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'Company' && <DividerStyle />}
            <WorkedCompanyFilter
              selectedWorkedCompanies={searchedValue.companyWorkeds}
              companyRemoved={(company) => dispatch(removeSearchCompany(company))}
              companySelected={(company) => dispatch(addSearchCompany(company))}
            />
            {expandedFilter === 'Company' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle> */}
      </SearchSidebarStyled>
    </>
  );
}
