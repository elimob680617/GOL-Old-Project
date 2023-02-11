import { Box, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, CloseSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { School } from 'src/@types/sections/serverTypes';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { userSchoolUpdated } from 'src/redux/slices/profile/userSchool-slice';
import { useDispatch } from 'src/redux/store';
import debounceFn from 'src/utils/debounce';
import { useCreateSchoolMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createSchool.generated';
import { useLazySearchSchoolsQuery } from 'src/_requests/graphql/profile/publicDetails/queries/searchSchools.generated';

export default function SchoolNameDialog() {
  const router = useRouter();
  const theme = useTheme();
  const [searching, setSearching] = useState<boolean>();

  // Query
  const [searchSchool, { data, isFetching }] = useLazySearchSchoolsQuery();

  const handleInputChange = (val: string) => {
    setSearching(!!val.length);
    if (val.length > 2)
      debounceFn(() =>
        searchSchool({
          filter: {
            dto: {
              title: val,
            },
          },
        })
      );
  };

  // Mutation
  const [createSchool] = useCreateSchoolMutation();
  // For Redux
  const dispatch = useDispatch();
  const handleChange = async (value: School & { inputValue?: string }) => {
    if (value.inputValue) {
      //add mutation func
      const response: any = await createSchool({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (response?.data?.createSchool?.isSuccess) {
        const data = response?.data?.createSchool?.listDto?.items?.[0];
        dispatch(
          userSchoolUpdated({
            school: {
              id: data.id,
              title: data.title,
            },
            isChange: true,
          })
        );
        router.back();
      }
    } else {
      dispatch(
        userSchoolUpdated({
          school: value,
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
              High School Name
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
            options={data?.searchSchools?.listDto?.items || []}
            placeholder="School Name"
          />
          <Box>
            <Box mt={6} />
            {!searching && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.seconary">
                  Start typing to find your School
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}
