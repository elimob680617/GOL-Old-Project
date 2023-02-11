import { Accordion, AccordionDetails, AccordionSummary, Divider, Stack, styled, Typography } from '@mui/material';
import React, { useState } from 'react';
import {
  addIndustry,
  getSearchedValues,
  removeIndustry,
  resetSearch,
  setNgoSize,
  setSearchLocation,
} from 'src/redux/slices/search';
import { useDispatch, useSelector } from 'src/redux/store';
import IndustryFilter from '../filters/IndustryFilter';
import LocationFilter from '../filters/LocationFilter';
import { SearchBadgeStyle, SearchSidebarStyled } from '../SharedStyled';
import NgoSize from '../filters/NgoSize';

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

type Expanded = 'Location' | 'Industry' | 'NGO Size';

const ClearAllStyle = styled(Typography)(({ theme }) => ({}));
export default function NgoFilter() {
  const searchedValue = useSelector(getSearchedValues);
  const dispatch = useDispatch();
  const [expandedFilter, setExpandedFilter] = useState<Expanded | null>(null);
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
              locationSelected={(place) => dispatch(setSearchLocation([...searchedValue.locations, place]))}
              locationRemoved={(place) =>
                dispatch(setSearchLocation([...searchedValue.locations.filter((i) => i.id !== place.id)]))
              }
              selectedLocations={searchedValue.locations}
            />
            {expandedFilter === 'Location' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>

        <AccordionStyle expanded={expandedFilter === 'Industry'} onChange={handleExpandedChange('Industry')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={searchedValue.industries.length === 0}>
              <Typography variant="body2" color="text.primary">
                Industry
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'Industry' && <DividerStyle />}
            <IndustryFilter
              selectedIndustries={searchedValue.industries}
              industrySelected={(industry) => dispatch(addIndustry(industry))}
              industryRemoved={(industry) => dispatch(removeIndustry(industry))}
            />
            {expandedFilter === 'Industry' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>

        <AccordionStyle expanded={expandedFilter === 'NGO Size'} onChange={handleExpandedChange('NGO Size')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={!searchedValue.ngoSize.length}>
              <Typography variant="body2" color="text.primary">
                NGO Size
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'NGO Size' && <DividerStyle />}
            <NgoSize sizeChanged={(size) => dispatch(setNgoSize(size))} ngoSize={searchedValue.ngoSize} />
          </AccordionDetailsStyle>
        </AccordionStyle>
      </SearchSidebarStyled>
    </>
  );
}
