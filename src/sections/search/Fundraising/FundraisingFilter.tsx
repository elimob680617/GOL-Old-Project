import { Accordion, AccordionDetails, AccordionSummary, Divider, Stack, styled, Typography } from '@mui/material';
import React, { useState } from 'react';
import {
  addFundraisingCategory,
  getSearchedValues,
  removeFundraisingCategory,
  resetSearch,
  setSearchLocation,
  setSearchNgoFilter,
  setSearchSor,
} from 'src/redux/slices/search';
import { useDispatch, useSelector } from 'src/redux/store';
import FundraisingCategoryFilter from '../filters/FundraisingCategory';
import LocationFilter from '../filters/LocationFilter';
import NgoFiltering from '../filters/NgoFiltering';
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

type Expanded = 'Type' | 'Creation Date' | 'Category' | 'Location' | 'NGO';

const ClearAllStyle = styled(Typography)(({ theme }) => ({}));
export default function FundraisingFilter() {
  const [expandedFilter, setExpandedFilter] = useState<Expanded | null>(null);
  const dispatch = useDispatch();
  const searchedValue = useSelector(getSearchedValues);

  const handleExpandedChange = (panel: Expanded) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFilter(isExpanded ? panel : null);
  };

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

        <AccordionStyle expanded={expandedFilter === 'Creation Date'} onChange={handleExpandedChange('Creation Date')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={!searchedValue.sortBy}>
              <Typography variant="body2" color="text.primary">
                Creation Date
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'Creation Date' && <DividerStyle />}
            <CreattionTimeSort
              creattionTime={searchedValue.sortBy}
              creationTimeChanged={(sort) => dispatch(setSearchSor(sort))}
            />
            {expandedFilter === 'Creation Date' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>
        <AccordionStyle expanded={expandedFilter === 'Category'} onChange={handleExpandedChange('Category')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={searchedValue.fundraisingCategory.length === 0}>
              <Typography variant="body2" color="text.primary">
                Category
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'Category' && <DividerStyle />}
            <FundraisingCategoryFilter
              selectedCategories={searchedValue.fundraisingCategory}
              categoryRemoved={(category) => dispatch(removeFundraisingCategory(category))}
              categorySelected={(category) => dispatch(addFundraisingCategory(category))}
            />
            {expandedFilter === 'Category' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>
        <AccordionStyle expanded={expandedFilter === 'Location'} onChange={handleExpandedChange('Location')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={searchedValue.locations.length === 0}>
              <Typography variant="body2" color="text.primary">
                Location
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'Location' && <DividerStyle />}
            <LocationFilter
              selectedLocations={searchedValue.locations}
              locationSelected={(place) => dispatch(setSearchLocation([...searchedValue.locations, place]))}
              locationRemoved={(place) =>
                dispatch(setSearchLocation([...searchedValue.locations.filter((i) => i.id !== place.id)]))
              }
            />
            {expandedFilter === 'Location' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>
        <AccordionStyle expanded={expandedFilter === 'NGO'} onChange={handleExpandedChange('NGO')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={searchedValue.ngos.length === 0}>
              <Typography variant="body2" color="text.primary">
                NGO
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'NGO' && <DividerStyle />}
            <NgoFiltering
              selectedNgos={searchedValue.ngos}
              ngoSelected={(ngo) => dispatch(setSearchNgoFilter([...searchedValue.ngos, ngo]))}
              ngoRemoved={(ngo) => dispatch(setSearchNgoFilter([...searchedValue.ngos.filter((i) => i.id !== ngo.id)]))}
            />
          </AccordionDetailsStyle>
        </AccordionStyle>
      </SearchSidebarStyled>
    </>
  );
}
