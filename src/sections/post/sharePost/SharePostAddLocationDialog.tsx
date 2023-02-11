import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SelectLocationRow from 'src/components/location/LocationSelect';
import NotFound from 'src/components/notFound/NotFound';
import { basicSharePostSelector, setSharedPostLocation } from 'src/redux/slices/post/sharePost';
import { dispatch, useSelector } from 'src/redux/store';
import useDebounce from 'src/utils/useDebounce';
import { useLazySearchPlacesQuery } from 'src/_requests/graphql/locality/queries/searchPlaces.generated';
//icon
import { Icon } from 'src/components/Icon';

const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));
const OneLineTextStyle = styled(Typography)(({ theme }) => ({
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  color: theme.palette.text.primary,
  fontWeight: 500,
  lineHeight: '23px',
  fontSize: '16px',
}));
interface IPostRoute {
  routeType?: 'home' | 'postDetails';
}
const SharePostAddLocationDialog = (props: IPostRoute) => {
  const { routeType = 'home' } = props;
  const { back } = useRouter();
  const theme = useTheme();
  const [getPlacesQuery, { data: places, isFetching: fetchingPlaceLoading }] = useLazySearchPlacesQuery();
  const [searchedText, setSearchedText] = useState<string>('');
  const [createPlaceLoading, setCreatePlaceLoading] = useState<boolean>(false);
  const post = useSelector(basicSharePostSelector);
  const debouncedValue = useDebounce<string>(searchedText, 500);

  useEffect(() => {
    if (debouncedValue)
      getPlacesQuery({
        filter: { dto: { searchText: debouncedValue } },
      });
  }, [debouncedValue, getPlacesQuery]);

  const getCreatePlaceLoading = (loading: boolean) => {
    setCreatePlaceLoading(loading);
  };

  return (
    <>
      <Dialog maxWidth="sm" fullWidth open={true} aria-labelledby="responsive-dialog-title">
        <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
          <HeaderWrapperStyle spacing={2} direction="row" alignItems="center">
            <IconButton onClick={() => back()} sx={{ padding: 0 }}>
              <Icon name="left-arrow-1" color="grey.500" type="linear" />
            </IconButton>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.primary}
              sx={{
                color: 'grey.900',
                fontWeight: 500,
              }}
            >
              Search your location
            </Typography>
          </HeaderWrapperStyle>
        </DialogTitle>

        {!createPlaceLoading && (
          <DialogContent sx={{ height: 600, marginTop: 2, paddingRight: 0, paddingLeft: 0 }}>
            <Stack spacing={3}>
              <Box sx={{ width: '100%', paddingRight: 3, paddingLeft: 3 }}>
                <TextField
                  value={searchedText}
                  onChange={(e) => setSearchedText(e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Where are you?"
                  InputProps={{
                    endAdornment: searchedText && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setSearchedText('')}>
                          <Icon name="Close" color="grey.500" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {post.location && post.location.id && !debouncedValue && (
                <Box sx={{ paddingRight: 3, paddingLeft: 3 }}>
                  <Typography
                    sx={[
                      (theme) => ({
                        color: theme.palette.text.primary,
                        fontSize: '20px',
                        lineHeight: '25px',
                        fontWeight: 700,
                      }),
                    ]}
                    variant="h5"
                  >
                    Currently Selected
                  </Typography>
                  <Stack
                    sx={{ marginTop: 3, height: 24, marginBottom: 3 }}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <OneLineTextStyle variant="subtitle1">{post.location.address}</OneLineTextStyle>

                    <IconButton onClick={() => dispatch(setSharedPostLocation(null))} sx={{ padding: '1px' }}>
                      <Icon name="Close" color="grey.500" type="linear" />
                    </IconButton>
                  </Stack>
                </Box>
              )}

              {!fetchingPlaceLoading && (
                <Stack spacing={2}>
                  {debouncedValue &&
                  places &&
                  places.searchPlaces &&
                  places.searchPlaces.listDto &&
                  places.searchPlaces.listDto.items &&
                  places.searchPlaces.listDto.items[0]?.predictions &&
                  places.searchPlaces.listDto.items[0]?.predictions?.length > 0 ? (
                    places?.searchPlaces.listDto?.items[0]?.predictions?.map((place, index) => {
                      if (index === 0) {
                        return (
                          <Box sx={{ paddingRight: 3, paddingLeft: 3 }}>
                            <SelectLocationRow
                              routeType={routeType}
                              locationType="share"
                              id={place?.placeId as string}
                              address={place?.description as string}
                              name={place?.structuredFormatting?.mainText as string}
                              secondaryText={place?.structuredFormatting?.secondaryText as string}
                              variant="home"
                              createPostLoadingChange={getCreatePlaceLoading}
                            />
                          </Box>
                        );
                      } else {
                        return (
                          <Stack spacing={2}>
                            <Divider />
                            <Box sx={{ paddingRight: 3, paddingLeft: 3 }}>
                              <SelectLocationRow
                                routeType={routeType}
                                locationType="share"
                                id={place?.placeId as string}
                                address={place?.description as string}
                                name={place?.structuredFormatting?.mainText as string}
                                secondaryText={place?.structuredFormatting?.secondaryText as string}
                                variant="home"
                                createPostLoadingChange={getCreatePlaceLoading}
                              />
                            </Box>
                          </Stack>
                        );
                      }
                    })
                  ) : (
                    <Box sx={{ marginTop: 8 }}>
                      <NotFound
                        img={!debouncedValue ? '/images/location/location.svg' : undefined}
                        text={!debouncedValue ? 'Search here to find your location' : 'Sorry! No results found'}
                      />
                    </Box>
                  )}
                </Stack>
              )}
            </Stack>
            {fetchingPlaceLoading && debouncedValue && (
              <Stack sx={{ marginTop: 4 }} alignItems="center">
                <CircularProgress />
              </Stack>
            )}
          </DialogContent>
        )}
        {createPlaceLoading && (
          <Stack
            spacing={3}
            sx={{ height: 600, marginTop: 2, paddingRight: 0, paddingLeft: 0 }}
            alignItems="center"
            justifyContent="center"
          >
            <img src="/images/location/location.svg" alt="image" />
            <Typography
              variant="body1"
              sx={{ fontWeight: '300', fontSize: '16px', lineHeight: '20px', color: 'text.primary' }}
            >
              Please wait...
            </Typography>
          </Stack>
        )}
      </Dialog>
    </>
  );
};

export default SharePostAddLocationDialog;
