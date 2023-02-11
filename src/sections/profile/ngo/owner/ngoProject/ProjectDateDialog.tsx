import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';
import { ngoProjectSelector, projectAdded } from 'src/redux/slices/profile/ngoProject-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';

interface ExperienceDateDialogProps {
  isEndDate?: boolean;
}

const ProjectDateDialog: FC<ExperienceDateDialogProps> = (props) => {
  const { isEndDate = false } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const projectData = useSelector(ngoProjectSelector);

  useEffect(() => {
    if (!projectData) router.push(PATH_APP.profile.ngo.project.list);
  }, [projectData, router]);

  const handleChange = (date: Date) => {
    if (!isEndDate)
      dispatch(
        projectAdded({
          startDate: date,
          isChange: true,
        })
      );
    else
      dispatch(
        projectAdded({
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
          <Icon name="left-arrow-1" />
        </IconButton>
        <Typography variant="subtitle1">{!isEndDate ? 'Start Date' : 'End Date'}</Typography>
      </Stack>
      <Divider />

      <Box sx={{ p: 3 }}>
        <DatePicker
          value={
            isEndDate
              ? projectData?.endDate
                ? new Date(projectData?.endDate)
                : new Date()
              : projectData?.startDate
              ? new Date(projectData?.startDate)
              : undefined
          }
          minDate={isEndDate && projectData?.startDate ? new Date(projectData?.startDate) : undefined}
          maxDate={!isEndDate && projectData?.endDate ? new Date(projectData?.endDate) : undefined}
          views={['month', 'year']}
          onChange={handleChange}
        />
      </Box>
    </Dialog>
  );
};

export default ProjectDateDialog;
