import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';
import {
  ngoEstablishmentDateSelector,
  ngoEstablishmentDateUpdated,
} from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch, useSelector } from 'src/redux/store';

const EstablishedDateDialog = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ngoEstablishedDate = useSelector(ngoEstablishmentDateSelector);

  const handleChange = (value: Date) => {
    console.log(value);
    dispatch(
      ngoEstablishmentDateUpdated({
        establishmentDate: value,
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
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Date of Establishment
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Box px={3}>
          <DatePicker
            value={ngoEstablishedDate?.establishmentDate ? new Date(ngoEstablishedDate?.establishmentDate) : undefined}
            views={['month', 'year']}
            onChange={handleChange}
          />
        </Box>
      </Stack>
    </Dialog>
  );
};
export default EstablishedDateDialog;
