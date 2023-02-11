import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft, CloseSquare } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import AutoComplete from 'src/components/AutoComplete';
import { userLocationSelector, userLocationUpdated } from 'src/redux/slices/profile/userLocation-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import debounceFn from 'src/utils/debounce';
import { useLazySearchCitiesQuery } from 'src/_requests/graphql/locality/queries/searchCities.generated';

function CurrentCity() {
  const [searchCities, { data, isFetching }] = useLazySearchCitiesQuery();
  const router = useRouter();
  const dispatch = useDispatch();
  const [searching, setSearching] = useState<boolean>();
  const userCity = useSelector(userLocationSelector);

  const handleInputChange = (val: string) => {
    if (!!val) {
      setSearching(true);
    } else {
      setSearching(false);
    }
    if (val.length > 2)
      debounceFn(() =>
        searchCities({
          filter: {
            dto: {
              seearchValue: val,
            },
          },
        })
      );
  };

  const handleChange = (val: any) => {
    dispatch(
      userLocationUpdated({
        city: { id: val?.id, name: val?.title },
        isChange: true,
      })
    );
    router.back();
  };

  const citiesOption = useMemo(
    () => data?.searchCities?.listDto?.items?.map((item) => ({ id: item?.id, title: item?.name })),
    [data?.searchCities.listDto?.items]
  );

  useEffect(() => {
    if (!userCity) router.push(PATH_APP.profile.user.publicDetails.root);
  }, [userCity, router]);
  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 320, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Current City
            </Typography>
          </Box>
          <Link href={PATH_APP.profile.user.publicDetails.currentCity.discard} passHref>
            <IconButton>
              <CloseSquare />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <AutoComplete
            autoFocus
            loading={isFetching}
            onInputChange={(ev, val) => handleInputChange(val)}
            onChange={(ev, val) => handleChange(val)}
            options={citiesOption || []}
            placeholder="Current City"
          />
          {!searching && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Typography color="text.secondary" variant="body2">
                  Start typing to find your Current City
                </Typography>
              </Box>
            </Box>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default CurrentCity;
