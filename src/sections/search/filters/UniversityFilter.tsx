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
import { ICollege } from 'src/@types/education';
import { InstituteType } from 'src/@types/sections/serverTypes';
import useDebounce from 'src/utils/useDebounce';
import { useLazyGetCollegeForFilterQuery } from 'src/_requests/graphql/search/filters/queries/getCollegeForFilter.generated';

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

interface IUniversityFilterProps {
  selecedUniversities: ICollege[];
  universitySelected: (place: ICollege) => void;
  universityRemoved: (place: ICollege) => void;
}

const UniversityFilter: FC<IUniversityFilterProps> = ({
  selecedUniversities,
  universityRemoved,
  universitySelected,
}) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  const [getColleges, { isFetching: gettingUniversityLoading, data: universities }] = useLazyGetCollegeForFilterQuery();

  useEffect(() => {
    getColleges({
      filter: {
        dto: { searchText: searcheDebouncedValue, instituteType: InstituteType.University },
        pageIndex: 1,
        pageSize: 5,
      },
    });
  }, [searcheDebouncedValue]);

  const checkChecked = (college: ICollege) => selecedUniversities.some((i) => i.id === college.id);
  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="university"
        placeholder="University Names"
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
        {selecedUniversities.map((university) => (
          <Chip
            key={`selected-university-${university.id}`}
            label={university.title}
            onDelete={() => universityRemoved(university)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>
      {gettingUniversityLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {!gettingUniversityLoading && (
        <>
          {universities &&
            universities?.collegeSearchQueryHandler &&
            universities?.collegeSearchQueryHandler?.listDto &&
            universities?.collegeSearchQueryHandler?.listDto?.items &&
            universities?.collegeSearchQueryHandler?.listDto?.items.map((university) => (
              <Stack key={university!.id} alignItems="center" direction="row" spacing={1}>
                <Checkbox
                  checked={checkChecked(university!)}
                  onChange={() =>
                    checkChecked(university!) ? universityRemoved(university!) : universitySelected(university!)
                  }
                />
                <Avatar sx={{ width: 32, height: 32 }}>{university!.title![0] || ''}</Avatar>
                <Tooltip title={university!.title! || ''}>
                  <ElipsesText noWrap data-text={university!.title! || ''} variant="subtitle2" color="text.primary">
                    {university!.title! || ''}
                  </ElipsesText>
                </Tooltip>
              </Stack>
            ))}
        </>
      )}
    </Stack>
  );
};

export default UniversityFilter;
