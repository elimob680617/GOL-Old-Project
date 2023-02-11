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
import { IExperirnce } from 'src/@types/experience';
import useDebounce from 'src/utils/useDebounce';
import { useLazyGetCompanyForFilterQuery } from 'src/_requests/graphql/search/filters/queries/getCompanyForFilter.generated';

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

interface IWorkedCompanyFilterProps {
  selectedWorkedCompanies: IExperirnce[];
  companySelected: (company: IExperirnce) => void;
  companyRemoved: (company: IExperirnce) => void;
}

const WorkedCompanyFilter: FC<IWorkedCompanyFilterProps> = ({
  selectedWorkedCompanies,
  companyRemoved,
  companySelected,
}) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  const [getCompanies, { isFetching: gettingCollegeLoading, data: companies }] = useLazyGetCompanyForFilterQuery();

  useEffect(() => {
    getCompanies({
      filter: {
        dto: { searchText: searcheDebouncedValue },
        pageIndex: 1,
        pageSize: 5,
      },
    });
  }, [searcheDebouncedValue]);

  const checkChecked = (company: IExperirnce) => selectedWorkedCompanies.some((i) => i.id === company.id);
  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="company"
        placeholder="Company Names"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img src="/icons/Research/research.svg" width={24} height={24} alt="search" />
            </InputAdornment>
          ),
        }}
      />
      <Stack spacing={1} gap={1} direction="row" flexWrap="wrap">
        {selectedWorkedCompanies.map((company) => (
          <Chip
            key={`selected-college-${company.id}`}
            label={company.title}
            onDelete={() => companyRemoved(company)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      {gettingCollegeLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {!gettingCollegeLoading && (
        <>
          {companies &&
            companies.companySearchQueryHandler &&
            companies.companySearchQueryHandler.listDto &&
            companies.companySearchQueryHandler.listDto.items &&
            companies.companySearchQueryHandler.listDto.items.map((company) => (
              <Stack key={company!.id} alignItems="center" direction="row" spacing={1}>
                <Checkbox
                  checked={checkChecked(company!)}
                  onChange={() => (checkChecked(company!) ? companyRemoved(company!) : companySelected(company!))}
                />
                <Avatar sx={{ width: 32, height: 32 }}>{company!.title![0] || ''}</Avatar>
                <Tooltip title={company!.title || ''}>
                  <ElipsesText noWrap data-text={company!.title} variant="subtitle2" color="text.primary">
                    {company!.title}
                  </ElipsesText>
                </Tooltip>
              </Stack>
            ))}
        </>
      )}
    </Stack>
  );
};

export default WorkedCompanyFilter;
