import React, { VFC } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'iconsax-react';
import { useDispatch, useSelector } from 'src/redux/store';
import DatePicker from 'src/components/DatePicker';
import { Dialog, IconButton, Stack, Typography, Divider, Box } from '@mui/material';
import { userCollegesSelector, userCollegeUpdated } from 'src/redux/slices/profile/userColloges-slice';

interface CollegUniversityDateDialogProps {
  isEndDate?: boolean;
}

const CollegeDateDialog: VFC<CollegUniversityDateDialogProps> = (props) => {
  const { isEndDate = false } = props; //destruct props
  const router = useRouter();
  const userColleges = useSelector(userCollegesSelector);

  //ّFor Redux
  const dispatch = useDispatch();
  const handleChange = (value: Date) => {
    console.log(value);
    if (!isEndDate)
      dispatch(
        userCollegeUpdated({
          startDate: value,
          isChange: true,
        })
      );
    else
      dispatch(
        userCollegeUpdated({
          endDate: value.toISOString(),
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
              {/* Start Date */}
              {!isEndDate ? 'Start Date' : 'End Date'}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Box px={3}>
          <DatePicker
            value={
              isEndDate
                ? userColleges?.endDate
                  ? new Date(userColleges?.endDate)
                  : new Date()
                : userColleges?.startDate
                ? new Date(userColleges?.startDate)
                : undefined
            }
            minDate={isEndDate && userColleges?.startDate ? new Date(userColleges?.startDate) : undefined}
            maxDate={!isEndDate && userColleges?.endDate ? new Date(userColleges?.endDate) : undefined}
            views={['month', 'year']}
            onChange={handleChange}
          />
        </Box>
      </Stack>
    </Dialog>
  );
};
export default CollegeDateDialog;
