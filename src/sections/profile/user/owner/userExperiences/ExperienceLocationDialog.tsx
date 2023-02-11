// @mui
import { Dialog, IconButton, Stack, Typography, Box } from '@mui/material';
// components
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/router';
import AutoComplete from 'src/components/AutoComplete';
import { experienceAdded, userExperienceSelector } from 'src/redux/slices/profile/userExperiences-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import debounceFn from 'src/utils/debounce';
import { useLazySearchCitiesQuery } from 'src/_requests/graphql/locality/queries/searchCities.generated';
import { useEffect, useMemo, useState } from 'react';
import { PATH_APP } from 'src/routes/paths';

function ExperienceLocationDialog() {
  const [searchCities, { data, isFetching }] = useLazySearchCitiesQuery();
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const experienceData = useSelector(userExperienceSelector);

  useEffect(() => {
    if (!experienceData) router.push(PATH_APP.profile.user.experience.root);
  }, [experienceData, router]);

  const handleInputChange = (val: string) => {
    setIsTyping(!!val.length);
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

  const handleChange = (val: { title: string; id: string }) => {
    dispatch(
      experienceAdded({
        cityDto: { id: val.id, name: val.title },
        isChange: true,
      })
    );
    router.back();
  };

  const citiesOptions = useMemo(
    () => data?.searchCities?.listDto?.items?.map((_) => ({ id: _?.id, title: _?.name })),
    [data?.searchCities?.listDto?.items]
  );

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ px: 2, py: 3, minHeight: 320 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="subtitle2" color="text.primary">
            Location
          </Typography>
        </Stack>

        <AutoComplete
          autoFocus
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
          options={citiesOptions || []}
          // getOptionLabel={option => option.name}
          placeholder="Search"
        />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 7 }}>
            {!isTyping && (
              <Typography color="text.secondary" variant="body2">
                Start typing to find your Location Name
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Dialog>
  );
}

export default ExperienceLocationDialog;
