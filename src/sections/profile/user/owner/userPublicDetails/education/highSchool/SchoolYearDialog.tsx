import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/router';
import React from 'react';
import DatePicker from 'src/components/DatePicker';
import { userSchoolsSelector, userSchoolUpdated } from 'src/redux/slices/profile/userSchool-slice';
import { useDispatch, useSelector } from 'src/redux/store';

export default function SchoolYearDialog() {
  const router = useRouter();

  const userHighSchool = useSelector(userSchoolsSelector);
  const dispatch = useDispatch();
  const handleChange = (value: Date) => {
    dispatch(
      userSchoolUpdated({
        year: value.getFullYear(),
        isChange: true,
      })
    );
    router.back();
  };

  return (
    <Dialog maxWidth="sm" open keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ py: 3, minHeight: 320 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Class Year
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Box px={3}>
          <DatePicker
            value={!!userHighSchool?.year ? new Date(userHighSchool.year, 1) : new Date(2022, 1)}
            views={['year']}
            minDate={new Date(1970, 1)}
            onChange={(date) => handleChange(date)}
          />
        </Box>
      </Stack>
    </Dialog>
  );
}
