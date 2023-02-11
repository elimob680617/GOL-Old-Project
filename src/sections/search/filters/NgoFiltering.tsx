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
import { ISearchNgoReponse } from 'src/@types/user';
import useDebounce from 'src/utils/useDebounce';
import { useLazyGetNgoSearchQuery } from 'src/_requests/graphql/search/queries/getNgoSearch.generated';

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

interface INgoFilteringProps {
  selectedNgos: ISearchNgoReponse[];
  ngoSelected: (place: ISearchNgoReponse) => void;
  ngoRemoved: (place: ISearchNgoReponse) => void;
}

const NgoFiltering: FC<INgoFilteringProps> = ({ ngoRemoved, ngoSelected, selectedNgos }) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  const [getNgo, { isFetching: fetchingLoading, data: ngos }] = useLazyGetNgoSearchQuery();

  useEffect(() => {
    if (!searcheDebouncedValue) return;
    getNgo({
      filter: {
        dto: { searchText: searcheDebouncedValue },
        pageIndex: 1,
        pageSize: 5,
      },
    });
  }, [searcheDebouncedValue]);

  const checkChecked = (ngo: ISearchNgoReponse) => selectedNgos.some((i) => i.id === ngo.id);

  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="ngo"
        placeholder="Ngo Names"
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
        {selectedNgos.map((ngo) => (
          <Chip
            key={`selected-ngo-${ngo.id}`}
            label={ngo.fullName}
            onDelete={() => ngoRemoved(ngo)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      {fetchingLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {!fetchingLoading && searcheDebouncedValue && (
        <>
          {ngos?.ngoSearchQueryHandler?.listDto?.items!.map((ngo) => (
            <Stack key={ngo!.id} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(ngo as ISearchNgoReponse)}
                onChange={() =>
                  checkChecked(ngo as ISearchNgoReponse)
                    ? ngoRemoved(ngo as ISearchNgoReponse)
                    : ngoSelected(ngo as ISearchNgoReponse)
                }
              />
              <Avatar sx={{ width: 32, height: 32 }}>{ngo!.fullName![0] || ''}</Avatar>
              <Tooltip title={ngo!.fullName || ''}>
                <ElipsesText noWrap data-text={ngo!.fullName} variant="subtitle2" color="text.primary">
                  {ngo!.fullName}
                </ElipsesText>
              </Tooltip>
            </Stack>
          ))}
        </>
      )}

      {!searcheDebouncedValue && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            Start typing to find Ngos
          </Typography>
        </Stack>
      )}

      {ngos &&
        ngos.ngoSearchQueryHandler &&
        ngos.ngoSearchQueryHandler.listDto &&
        ngos.ngoSearchQueryHandler.listDto.items &&
        searcheDebouncedValue &&
        !fetchingLoading &&
        ngos?.ngoSearchQueryHandler?.listDto?.items.length === 0 && (
          <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
            <Typography variant="body2" color="grey.500">
              No Result Found
            </Typography>
          </Stack>
        )}
    </Stack>
  );
};

export default NgoFiltering;
