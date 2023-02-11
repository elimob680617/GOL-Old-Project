import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useEffect, VFC } from 'react';
import DatePicker from 'src/components/DatePicker';
import { experienceAdded, userExperienceSelector } from 'src/redux/slices/profile/userExperiences-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';

interface ExperienceDateDialogProps {
  isEndDate?: boolean;
}

const ExperienceDateDialog: VFC<ExperienceDateDialogProps> = (props) => {
  const { isEndDate = false } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const experienceData = useSelector(userExperienceSelector);

  useEffect(() => {
    if (!experienceData) router.push(PATH_APP.profile.user.experience.root);
  }, [experienceData, router]);

  const handleChange = (date: Date) => {
    if (!isEndDate)
      dispatch(
        experienceAdded({
          startDate: date,
          isChange: true,
        })
      );
    else
      dispatch(
        experienceAdded({
          endDate: date,
          isChange: true,
        })
      );
    router.back();
  };

  return (
    <Dialog maxWidth="xs" open onClose={() => router.back()}>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
          <ArrowLeft />
        </IconButton>
        <Typography variant="subtitle1">{!isEndDate ? 'Start Date' : 'End Date'}</Typography>
      </Stack>
      <Divider />

      <Box sx={{ p: 3 }}>
        <DatePicker
          value={
            isEndDate
              ? experienceData?.endDate
                ? new Date(experienceData?.endDate)
                : new Date()
              : experienceData?.startDate
              ? new Date(experienceData?.startDate)
              : undefined
          }
          minDate={isEndDate && experienceData?.startDate ? new Date(experienceData?.startDate) : undefined}
          maxDate={!isEndDate && experienceData?.endDate ? new Date(experienceData?.endDate) : undefined}
          views={['month', 'year']}
          onChange={handleChange}
        />
      </Box>
    </Dialog>
  );
};

export default ExperienceDateDialog;
