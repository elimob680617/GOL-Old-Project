import { Box, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, CloseSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Concentration } from 'src/@types/sections/serverTypes';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { userCollegeUpdated } from 'src/redux/slices/profile/userColloges-slice';
import { useDispatch } from 'src/redux/store';
import debounceFn from 'src/utils/debounce';
import { useCreateConcentrationMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createConcentraition.generated';
import { useLazySearchConcentrationsQuery } from 'src/_requests/graphql/profile/publicDetails/queries/concentration.generated';

export default function CollegeConcenterationDialog() {
  const theme = useTheme();
  const router = useRouter();
  const [searching, setSearching] = useState<boolean>();

  // Query
  const [concentration, { data, isFetching }] = useLazySearchConcentrationsQuery();
  // Mutation
  const [createConcentration] = useCreateConcentrationMutation();

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
        const concentrationData = response?.data?.createConcentration?.listDto?.items?.[0];
        dispatch(
          userCollegeUpdated({
            concentrationDto: { id: concentrationData?.id, title: concentrationData?.title },
            isChange: true,
          })
        );
        router.back();
      }
    } else {
      dispatch(
        userCollegeUpdated({
          concentrationDto: value,
          isChange: true,
        })
      );
      router.back();
    }
  };
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
            placeholder="Concentrarion"
          />
          <Box>
            <Box mt={6} />
            {!searching && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.seconary">
                  Start typing to find your Concentrarion
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}
