import { Avatar, Checkbox, Chip, Stack, styled, Tooltip, Typography } from '@mui/material';
import { FC } from 'react';
import { SearchCategoryEnumType } from 'src/@types/sections/serverTypes';

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

interface IFundraisingCategoryFilterProps {
  selectedCategories: SearchCategoryEnumType[];
  categorySelected: (category: SearchCategoryEnumType) => void;
  categoryRemoved: (category: SearchCategoryEnumType) => void;
}

const FundraisingCategoryFilter: FC<IFundraisingCategoryFilterProps> = ({
  selectedCategories,
  categoryRemoved,
  categorySelected,
}) => {
  // const [searchedValue, setSearchedValue] = useState<string>('');
  // const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  // const [getColleges, { isFetching: gettingCollegeLoading, data: colleges }] = useLazySearchCollegesQuery();

  // useEffect(() => {
  //   getColleges({
  //     filter: {
  //       dto: { name: searcheDebouncedValue, instituteType: InstituteTypeEnum.College },
  //       pageIndex: 1,
  //       pageSize: 5,
  //     },
  //   });
  // }, [searcheDebouncedValue]);

  const checkChecked = (category: string) => selectedCategories.some((i) => i === category);

  return (
    <Stack spacing={2}>
      {/* <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="college"
        placeholder="College Names"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img src="/icons/Research/research.svg" width={24} height={24} alt="search" />
            </InputAdornment>
          ),
        }}
      /> */}
      <Stack spacing={1} gap={1} direction="row" flexWrap="wrap">
        {selectedCategories.map((category) => (
          <Chip
            key={`selected-college-${category}`}
            label={category}
            onDelete={() => categoryRemoved(category)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      {/* {gettingCollegeLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )} */}

      {/* {!gettingCollegeLoading && (
        <>
          {colleges?.searchColleges?.listDto?.items.map((college) => (
            <Stack key={college.id} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(college)}
                onChange={() => (checkChecked(college) ? collegeRemoved(college) : collegeSelected(college))}
              />
              <Avatar sx={{ width: 32, height: 32 }}>{college.name[0]}</Avatar>
              <Tooltip title={college.name}>
                <ElipsesText noWrap data-text={college.name} variant="subtitle2" color="text.primary">
                  {college.name}
                </ElipsesText>
              </Tooltip>
            </Stack>
          ))}
        </>
      )} */}

      <Stack alignItems="center" direction="row" spacing={1}>
        <Checkbox
          checked={checkChecked(SearchCategoryEnumType.Art)}
          onChange={() =>
            checkChecked(SearchCategoryEnumType.Art)
              ? categoryRemoved(SearchCategoryEnumType.Art)
              : categorySelected(SearchCategoryEnumType.Art)
          }
        />
        <Avatar src="/icons/Campaign/Linear/Arts and culture.svg" sx={{ width: 32, height: 32 }} />
        <Tooltip title={SearchCategoryEnumType.Art}>
          <ElipsesText noWrap data-text={SearchCategoryEnumType.Art} variant="subtitle2" color="text.primary">
            Arts and culture
          </ElipsesText>
        </Tooltip>
      </Stack>
      <Stack alignItems="center" direction="row" spacing={1}>
        <Checkbox
          checked={checkChecked(SearchCategoryEnumType.Environment)}
          onChange={() =>
            checkChecked(SearchCategoryEnumType.Environment)
              ? categoryRemoved(SearchCategoryEnumType.Environment)
              : categorySelected(SearchCategoryEnumType.Environment)
          }
        />
        <Avatar src="/icons/Campaign/Linear/Agriculture.svg" sx={{ width: 32, height: 32 }} />
        <Tooltip title={SearchCategoryEnumType.Environment}>
          <ElipsesText noWrap data-text={SearchCategoryEnumType.Art} variant="subtitle2" color="text.primary">
            Agriculture
          </ElipsesText>
        </Tooltip>
      </Stack>

      <Stack alignItems="center" direction="row" spacing={1}>
        <Checkbox
          checked={checkChecked(SearchCategoryEnumType.Health)}
          onChange={() =>
            checkChecked(SearchCategoryEnumType.Health)
              ? categoryRemoved(SearchCategoryEnumType.Health)
              : categorySelected(SearchCategoryEnumType.Health)
          }
        />
        <Avatar src="/icons/Campaign/Linear/Economic Development.svg" sx={{ width: 32, height: 32 }} />
        <Tooltip title={SearchCategoryEnumType.Health}>
          <ElipsesText noWrap data-text={SearchCategoryEnumType.Health} variant="subtitle2" color="text.primary">
            Economic Development
          </ElipsesText>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default FundraisingCategoryFilter;
