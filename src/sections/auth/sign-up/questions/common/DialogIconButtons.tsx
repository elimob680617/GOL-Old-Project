import { Box, IconButton } from '@mui/material';
import { NextRouter } from 'next/router';
import React, { FC } from 'react';
import { AuthUser } from 'src/@types/auth';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useCompleteQarMutation } from 'src/_requests/graphql/profile/users/mutations/CompleteQAR.generated';

interface IconButtonsOnDialog {
  user: AuthUser;
  router: NextRouter;
  hasBackIcon?: boolean;
}

const DialogIconButtons: FC<IconButtonsOnDialog> = (props) => {
  const { user, router, hasBackIcon } = props;
  const [CompleteQar] = useCompleteQarMutation();

  const handleCloseDialog = async () => {
    const res: any = await CompleteQar({
      filter: { dto: { isNgo: user?.userType === UserTypeEnum.Ngo ? true : false } },
    });
    if (res?.data?.completeQar?.isSuccess) router.push(PATH_APP.home.index);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: hasBackIcon ? 'space-between' : 'flex-end' }}>
        {hasBackIcon && (
          <IconButton onClick={() => router.back()}>
            <Icon name="left-arrow" color="grey.500" />
          </IconButton>
        )}
        <IconButton onClick={handleCloseDialog}>
          <Icon name="Close-1" color="grey.500" />
        </IconButton>
      </Box>
    </>
  );
};

export default DialogIconButtons;
