import { Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GenderEnum, InputMaybe } from 'src/@types/sections/serverTypes';
import { updateMainInfo, userMainInfoSelector } from 'src/redux/slices/profile/userMainInfo-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';

function MainProfileGenderDialog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userMainInfo = useSelector(userMainInfoSelector);

  useEffect(() => {
    if (!userMainInfo) router.push(PATH_APP.profile.user.userEdit);
  }, [userMainInfo, router]);

  const handleSelectGender = (gender?: InputMaybe<GenderEnum>) => {
    dispatch(
      updateMainInfo({
        gender,
      })
    );
    router.back();
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle2" color="text.primary">
              Gender
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          {Object.keys(GenderEnum).map((gender) => (
            <Stack
              spacing={1.5}
              direction="row"
              key={gender}
              sx={{ cursor: 'pointer' }}
              onClick={() => handleSelectGender(gender as InputMaybe<GenderEnum>)}
            >
              <Typography variant="body2">{gender}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default MainProfileGenderDialog;
