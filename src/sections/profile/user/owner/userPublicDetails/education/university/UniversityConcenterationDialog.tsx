import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'src/redux/store';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { ArrowLeft, CloseSquare } from 'iconsax-react';
import { Concentration } from 'src/@types/sections/serverTypes';
import { Dialog, IconButton, Stack, Typography, Divider, useTheme, Box } from '@mui/material';
import { userUniversityUpdated } from 'src/redux/slices/profile/userUniversity-slice';
import { useLazySearchConcentrationsQuery } from 'src/_requests/graphql/profile/publicDetails/queries/concentration.generated';
import { useCreateConcentrationMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createConcentraition.generated';
import debounceFn from 'src/utils/debounce';

export default function UniversityConcenterationDialog() {
  const router = useRouter();
  const theme = useTheme();
  const [searching, setSearching] = useState<boolean>();

  const [concentration, { data, isFetching }] = useLazySearchConcentrationsQuery();
  const handleInputChange = (val: string) => {
    setSearching(!!val.length);
    if (val.length > 2)
      debounceFn(() =>
        concentration({
          filter: {
            dto: {
              title: val,
            },
          },
        })
      );
  };
  //Mutation
  const [createConcentration] = useCreateConcentrationMutation();
  //For Redux
  const dispatch = useDispatch();
  const handleChange = async (value: Concentration & { inputValue: string }) => {
    if (value.inputValue) {
      const response: any = await createConcentration({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (response?.data?.createConcentration?.isSuccess) {
        const uniData = response?.data?.createConcentration?.listDto?.items?.[0];
        dispatch(
          userUniversityUpdated({
            concentrationDto: { id: uniData?.id, title: uniData?.title },
            isChange: true,
          })
        );
        router.back();
      }
    } else {
      dispatch(
        userUniversityUpdated({
          concentrationDto: value,
          isChange: true,
        })
      );
      router.back();
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ py: 3, minHeight: 320 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Concenteration
            </Typography>
          </Stack>
          <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
            <CloseSquare variant="Outline" color={theme.palette.text.primary} />
          </IconButton>
        </Stack>
        <Divider />
        <Stack sx={{ px: 2 }}>
          <AutoCompleteAddable
            autoFocus
            loading={isFetching}
            onInputChange={(ev, val) => handleInputChange(val)}
            onChange={(ev, val) => handleChange(val)}
            options={data?.concentrations?.listDto?.items || []}
            placeholder="Concenteration"
          />
          <Box>
            <Box mt={6} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {!searching && (
                <Typography variant="body2" color="text.seconary">
                  Start typing to find your Concenteration
                </Typography>
              )}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}
