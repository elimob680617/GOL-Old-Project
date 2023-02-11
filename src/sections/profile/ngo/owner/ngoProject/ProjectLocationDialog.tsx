import { Box, Dialog, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import AutoComplete from 'src/components/AutoComplete';
import { Icon } from 'src/components/Icon';
import { ngoProjectSelector, projectAdded } from 'src/redux/slices/profile/ngoProject-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import debounceFn from 'src/utils/debounce';
import { useLazySearchCitiesQuery } from 'src/_requests/graphql/locality/queries/searchCities.generated';

function ProjectLocationDialog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const projectData = useSelector(ngoProjectSelector);
  const [isTyping, setIsTyping] = useState(false);
  const [searchCities, { data, isFetching }] = useLazySearchCitiesQuery();

  useEffect(() => {
    if (!projectData) router.push(PATH_APP.profile.ngo.project.list);
  }, [projectData, router]);

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
      projectAdded({
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
            <Icon name="left-arrow-1" />
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
                Start typing to find your Location
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Dialog>
  );
}

export default ProjectLocationDialog;
