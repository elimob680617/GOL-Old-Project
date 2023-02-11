import { Box, Dialog, Divider, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RestrictionTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { Loading } from 'src/components/loading';
import { ngoPlaceSelector, ngoPlaceUpdated } from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import debounceFn from 'src/utils/debounce';
import { useLazyGeocodeQuery } from 'src/_requests/graphql/locality/queries/geocode.generated';
import { useLazySearchPlacesQuery } from 'src/_requests/graphql/locality/queries/searchPlaces.generated';

export default function LocationNameDialog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const ngoPlace = useSelector(ngoPlaceSelector);
  const [searching, setSearching] = useState<boolean>();
  const [getGeocode, { data: location }] = useLazyGeocodeQuery();
  const [searchPlaces, { data, isFetching }] = useLazySearchPlacesQuery();

  const handleInputChange = (val: string) => {
    if (val.length > 1) {
      setSearching(true);
      debounceFn(() =>
        searchPlaces({
          filter: {
            dto: {
              searchText: val,
              restrictionType: RestrictionTypeEnum.None,
            },
          },
        })
      );
    }
  };
  const handleChange = (value: any & { inputValue?: string }) => {
    if (!!value?.placeId)
      getGeocode({
        filter: {
          dto: {
            placeId: value?.placeId,
          },
        },
      });
    dispatch(
      ngoPlaceUpdated({
        placeId: value.placeId,
        description: value.description,
        mainText: value.structuredFormatting?.mainText,
        lat: location?.geocode?.listDto?.items?.[0]?.lat,
        lng: location?.geocode?.listDto?.items?.[0]?.lng,
        isChange: true,
      })
    );
    router.back();
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ py: 3, minHeight: 320, minWidth: 600 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Search your location
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack spacing={2} px={2}>
          <TextField
            size="small"
            onChange={(e) => {
              handleInputChange((e.target as HTMLInputElement).value);
            }}
            variant="outlined"
            placeholder="Search"
          />
        </Stack>
        {!searching && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Start typing to find your Location
            </Typography>
          </Box>
        )}

        <Box>
          {isFetching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 6 }}>
              <Loading />
            </Box>
          ) : (
            <>
              {data?.searchPlaces?.listDto?.items?.[0]?.predictions?.map((place) => (
                <>
                  <Stack key={place?.placeId} direction="row" spacing={2} p={2} sx={{ cursor: 'default' }}>
                    <Box borderRadius={50} width={48} height={48} bgcolor="background.neutral">
                      {/* <img  width={24} height={24} alt="" style={{ marginRight: 8 }} /> */}
                    </Box>
                    <Stack spacing={0.5} onClick={() => handleChange(place)}>
                      <Typography variant="subtitle1" color="text.primary" sx={{ cursor: 'pointer' }}>
                        {place?.structuredFormatting?.mainText}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                        {place?.description}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider />
                </>
              ))}
            </>
          )}
        </Box>
      </Stack>
    </Dialog>
  );
}
