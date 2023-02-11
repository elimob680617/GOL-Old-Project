import { LoadingButton } from '@mui/lab';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useLayoutEffect, useState } from 'react';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { useCompleteQarMutation } from 'src/_requests/graphql/profile/users/mutations/CompleteQAR.generated';
import DialogIconButtons from './DialogIconButtons';

interface StartEndProp {
  isDone?: boolean;
}
const WelcomeWellDoneDialog: FC<StartEndProp> = (props) => {
  const { isDone } = props;
  const { user } = useAuth();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState<boolean>(true);
  const [CompleteQar, { isLoading }] = useCompleteQarMutation();

  useLayoutEffect(() => {
    if ((router.query.index?.[0] === 'welcome' || router.query.index?.[0] === 'done') && user?.completeQar) {
      setShowDialog(false);
      router.push(PATH_APP.home.index);
    }
  }, []);

  const handleRouting = async () => {
    if (!isDone) {
      if (user?.userType === UserTypeEnum.Normal) {
        router.push(PATH_APP.home.afterRegister.gender);
      } else {
        router.push(PATH_APP.home.afterRegister.location);
      }
    } else {
      const res: any = await CompleteQar({
        filter: { dto: { isNgo: user?.userType === UserTypeEnum.Ngo ? true : false } },
      });
      if (res?.data?.completeQar?.isSuccess) router.push(PATH_APP.home.index);
    }
  };
  const handleCloseDialog = async () => {
    const res: any = await CompleteQar({
      filter: { dto: { isNgo: user?.userType === UserTypeEnum.Ngo ? true : false } },
    });
    if (res?.data?.completeQar?.isSuccess) router.push(PATH_APP.home.index);
  };

  return (
    <Dialog fullWidth={true} open={showDialog} sx={{ minHeight: 398 }}>
      <DialogTitle>{!isDone && <DialogIconButtons router={router} user={user} />}</DialogTitle>
      <DialogContent>
        <Stack alignItems="center" mt={isDone ? 14 : 6.2}>
          <Box mb={3}>
            <Logo sx={{ width: 67, height: 67 }} />
          </Box>
          <Stack spacing={2} mb={10} alignItems="center">
            <Typography variant="h4" color="text.primary">
              {isDone ? 'Well Done.' : 'Welcome to Garden of love'}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {isDone ? 'Let’s surfing GOL' : 'Let us ask you a few questions!'}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
        <LoadingButton
          variant="contained"
          color="primary"
          endIcon={<Icon name="right-arrow-1" type="linear" color="common.white" />}
          onClick={handleRouting}
          loading={isDone && isLoading}
        >
          <Typography>{isDone ? 'Go to GOL' : 'Let’s go'}</Typography>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeWellDoneDialog;
