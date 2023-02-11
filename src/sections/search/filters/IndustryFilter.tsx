import {
  Avatar,
  Checkbox,
  Chip,
  CircularProgress,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { IIndustry } from 'src/@types/categories';
import useDebounce from 'src/utils/useDebounce';
import { useLazyGertIndustryForFilterQuery } from 'src/_requests/graphql/search/filters/queries/getIndustryForFilter.generated';

const ElipsesText = styled(Typography)(({ theme }) => ({
  //   position: 'relative',
  //   '&:focus, &:hover': {
  //     overflow: 'visible',
  //     color: 'transparent',
  //     '&:after': {
  //       content: 'attr(data-text)',
  //       overflow: 'visible',
  //       textOverflow: 'inherit',
  //       position: 'absolute',
  //       left: '0',
  //       top: '0',
  //       whiteSpace: 'normal',
  //       wordWrap: 'break-word',
  //       display: 'block',
  //       zIndex: 2,
  //       color: theme.palette.text.primary,
  //       maxWidth: 'min-content',
  //       backgroundColor: theme.palette.background.paper,
  //       boxShadow: '0 2px 4px 0 rgba(0,0,0,.28)',
  //       padding: theme.spacing(1),
  //       borderRadius: theme.spacing(1),
  //     },
  //   },
}));

interface IIndustryFilterProps {
  selectedIndustries: IIndustry[];
  industrySelected: (industry: IIndustry) => void;
  industryRemoved: (industry: IIndustry) => void;
}

const IndustryFilter: FC<IIndustryFilterProps> = ({ selectedIndustries, industryRemoved, industrySelected }) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searchedPlaceDebouncedValue = useDebounce<string>(searchedValue, 500);

  const [getIndustries, { isFetching: gettingIndustryLoading, data: industries }] = useLazyGertIndustryForFilterQuery();

  useEffect(() => {
    getIndustries({
      filter: {
        dto: { searchText: searchedPlaceDebouncedValue },
        pageIndex: 1,
        pageSize: 5,
      },
    });
  }, [searchedPlaceDebouncedValue]);

  const checkChecked = (industry: IIndustry) => selectedIndustries.some((i) => i.id === industry.id);

  return (
    <Stack spacing={2}>
      <TextField
        size="small"
        id="industry"
        placeholder="Industry"
        variant="outlined"
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img src="/icons/Research/research.svg" width={24} height={24} alt="search" />
            </InputAdornment>
          ),
        }}
      />

      <Stack spacing={1} gap={1} direction="row" flexWrap="wrap">
        {selectedIndustries.map((industry) => (
          <Chip
            key={`selected-industry-${industry.id}`}
            label={industry.title}
            onDelete={() => industryRemoved(industry)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      {gettingIndustryLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      {!gettingIndustryLoading && (
        <>
          {industries?.industrySearchQueryHandler?.listDto?.items?.map((industry) => (
            <Stack key={industry?.id} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(industry!)}
                onChange={() => (checkChecked(industry!) ? industryRemoved(industry!) : industrySelected(industry!))}
              />
              <Avatar sx={{ width: 32, height: 32 }}>{industry?.title?.[0]}</Avatar>
              <Tooltip title={industry?.title || ''}>
                <ElipsesText noWrap data-text={industry?.title} variant="subtitle2" color="text.primary">
                  {industry?.title}
                </ElipsesText>
              </Tooltip>
            </Stack>
          ))}
        </>
      )}
    </Stack>
  );
};

export default IndustryFilter;
