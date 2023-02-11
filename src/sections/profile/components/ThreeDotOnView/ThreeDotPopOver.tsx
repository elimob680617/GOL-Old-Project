import { Button, Popover, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { FC, useState } from 'react';
import { RequestEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import ReportParentDialog, { BlockIcon } from 'src/components/reportPostAndProfile/ReportParentDialog';
import ReportWarningDialog from 'src/components/reportPostAndProfile/ReportWarningDialog';

interface ProfileThreeDotProp {
  itemId?: string;
  fullName: string;
  fromReport?: boolean;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  isFollowing: boolean;
  isBlocked?: boolean;
  isReported?: boolean;
}
const ThreeDotPopOver: FC<ProfileThreeDotProp> = (props) => {
  const { anchorEl, setAnchorEl, fullName, isFollowing, isBlocked, isReported } = props;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const ID = router?.query?.id?.[0];
  const [openReportProfile, setOpenReportProfile] = useState(false);
  const [openBlock, setOpenBlock] = useState(false);

  const handleCopyUrlLink = async () => {
    const url = location.href;
    await navigator.clipboard.writeText(url);
    setAnchorEl(null);
    enqueueSnackbar('Copied! ', { variant: 'success' });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Popover
        id="3dotpopup"
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack px={2} py={3}>
          <Button
            variant="text"
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
            onClick={handleCopyUrlLink}
            startIcon={<Icon name="Page-Collection" />}
          >
            <Typography color="text.primary">Copy Profile link</Typography>
          </Button>
          <Button
            variant="text"
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
            onClick={() => {
              setOpenBlock(true);
              setAnchorEl(null);
            }}
            disabled={isBlocked}
            color="error"
            startIcon={<Icon name="forbidden" color={!isBlocked ? 'error.main' : 'grey.300'} />}
          >
            <Typography>Block</Typography>
          </Button>
          <Button
            variant="text"
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
            disabled={isReported}
            onClick={() => {
              setOpenReportProfile(true);
              setAnchorEl(null);
            }}
            color="error"
            startIcon={<Icon name="Exclamation-Mark" color={!isReported ? 'error.main' : 'grey.300'} />}
          >
            <Typography>Report</Typography>
          </Button>
        </Stack>
      </Popover>
      {openBlock && (
        <ReportWarningDialog
          userId={ID}
          showDialog={openBlock}
          onCloseBlock={setOpenBlock}
          buttonText={'Block'}
          warningText={`Are you sure you want to Block ${fullName}?`}
          icon={BlockIcon}
          actionType={RequestEnum.Block}
        />
      )}
      {openReportProfile && (
        <ReportParentDialog
          reportType="profile"
          userId={ID as string}
          fullName={fullName}
          openDialog={openReportProfile}
          setOpenDialog={setOpenReportProfile}
          isFollowing={isFollowing as boolean}
          isBlocked={isBlocked as boolean}
        />
      )}
    </>
  );
};

export default ThreeDotPopOver;
