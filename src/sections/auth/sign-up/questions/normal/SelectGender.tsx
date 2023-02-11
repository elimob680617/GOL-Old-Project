import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { PATH_APP } from 'src/routes/paths';
// hooks
import { useRouter } from 'next/router';
import React, { useLayoutEffect } from 'react';
import useAuth from 'src/hooks/useAuth';
// services
import { GenderTsEnum } from 'src/@types/afterRegister';
import { GenderEnum, ProfileFieldEnum, UserTypeEnum } from 'src/@types/sections/serverTypes';
import { useUpdateProfileFiledMutation } from 'src/_requests/graphql/profile/mainProfile/mutations/updatePersonProfile.generated';
// redux
import { registerGenderSelector, registerGenderUpdated } from 'src/redux/slices/afterRegistration';
import { useDispatch, useSelector } from 'src/redux/store';
import TitleAndProgress from '../common/TitleAndProgress';
import { Icon } from 'src/components/Icon';
import DialogIconButtons from '../common/DialogIconButtons';

const GenderBoxStyle = styled(ToggleButtonGroup)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: 0,
  gap: theme.spacing(3),
  border: 'unset !important',
  '& .MuiToggleButtonGroup-grouped': {
    border: '1px solid  !important',
    borderColor: `${theme.palette.grey[100]} !important`,
    borderRadius: `${theme.spacing(2)} !important`,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
  },
  '& .Mui-selected': {
    borderColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: theme.palette.background.paper,
  },
}));
const ToggleButtonStyle = styled(ToggleButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  px: 3,
  cursor: 'pointer',
  border: '1px solid !important',
  width: 168,
  height: 48,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 0,
  borderRadius: theme.spacing(2),
}));

export default function SelectGender() {
  const { user } = useAuth();
  const router = useRouter();
  const [showDialog, setShowDialog] = React.useState<boolean>(true);
  const dispatch = useDispatch();
  const genderSelector = useSelector(registerGenderSelector);

  const [updateProfileField, { isLoading }] = useUpdateProfileFiledMutation();

  useLayoutEffect(() => {
    if (router.query.index?.[0] === 'gender' && user?.completeQar) {
      setShowDialog(false);
      router.push(PATH_APP.home.index);
    }
    if (user?.userType !== UserTypeEnum.Normal) {
      router.push(PATH_APP.home.afterRegister.welcome);
    }
  }, [user, router]);

  const handleChange = (event: React.MouseEvent<HTMLElement>, newGender: GenderEnum) => {
    dispatch(registerGenderUpdated(newGender));
  };

  const handleSubmitGender = async () => {
    const res: any = await updateProfileField({
      filter: {
        dto: {
          field: ProfileFieldEnum.Gender,
          gender: genderSelector,
        },
      },
    });
    if (res?.data?.updateProfileFiled?.isSuccess) {
      router.push(PATH_APP.home.afterRegister.location);
      // dispatch(registerGenderUpdated(undefined));
    }
  };

  return (
    <Dialog fullWidth={true} open={showDialog}>
      <DialogTitle>
        <DialogIconButtons router={router} user={user} hasBackIcon />
        <Stack alignItems="center" mt={-5}>
          <TitleAndProgress step={1} userType={user?.userType} />
        </Stack>
        <Stack alignItems="center" mb={3}>
          <Typography variant="h6" color="text.primary">
            What’s your gender?
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <GenderBoxStyle color="primary" value={genderSelector} exclusive onChange={handleChange}>
          {Object.keys(GenderTsEnum).map((gender) => (
            <ToggleButtonStyle key={gender} value={gender}>
              {gender}
            </ToggleButtonStyle>
          ))}
        </GenderBoxStyle>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mx={3}>
          <Link href={PATH_APP.home.afterRegister.location} passHref>
            <Button variant="outlined" sx={{ borderColor: 'grey.300' }}>
              <Typography color="grey.900">Skip</Typography>
            </Button>
          </Link>
          <LoadingButton
            loading={isLoading}
            disabled={!genderSelector}
            onClick={handleSubmitGender}
            variant="contained"
            color="primary"
            endIcon={<Icon name="right-arrow-1" color="common.white" />}
          >
            <Typography>Next</Typography>
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
