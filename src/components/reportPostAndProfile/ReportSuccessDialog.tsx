//mui
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
//icon
import { Dispatch, FC, SetStateAction } from 'react';
import { Icon } from 'src/components/Icon';
import { BlockIcon, ReportActionType, UnfollowIcon } from './ReportParentDialog';
import { ReportWarningModalProp } from './ReportWarningDialog';

const SuccessStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  backgroundColor: theme.palette.background.neutral,
  borderRadius: theme.spacing(1),
}));
interface SuccessReportProp {
  showDialog: boolean;
  isFollowing: boolean;
  isBlocked: boolean;
  fullName: string;
  onClose: Dispatch<
    SetStateAction<{
      parent: boolean;
      child: boolean;
      success: boolean;
      warning: boolean;
    }>
  >;
  setModal: Dispatch<SetStateAction<ReportWarningModalProp>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportSuccessDialog: FC<SuccessReportProp> = (props) => {
  const { showDialog, onClose, fullName, isFollowing, isBlocked, setModal, setOpenDialog } = props;
  const handleDone = () => {
    onClose!((prev) => ({ ...prev, success: false }));
    setOpenDialog(false);
  };

  return (
    <Dialog fullWidth={true} open={showDialog} keepMounted onClose={handleDone}>
      <Stack spacing={2}>
        <Stack sx={{ boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)', gap: 2 }}>
          <Stack direction="row" sx={{ px: 2, pt: 2 }} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1" color="text.primary">
                Report
              </Typography>
            </Box>
            <IconButton onClick={handleDone}>
              <Icon name="Close-1" color="grey.500" />
            </IconButton>
          </Stack>
          <Divider />
        </Stack>
        <Stack sx={{ px: 2 }}>
          <Stack mb={3}>
            <SuccessStyle spacing={1} justifyContent="center" alignItems="center">
              <Icon name="Approve-Tick" type="solid" color="success.main" />
              <Typography variant="subtitle2" color="success.main">
                Your report has been submitted
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your feedback is important in helping us keep the Garden of love community safe.
              </Typography>
            </SuccessStyle>
          </Stack>
          <Stack spacing={3} pb={4}>
            <Box>
              <Typography variant="subtitle2" color="text.primary">
                Other actions you can take:
              </Typography>
            </Box>
            {isFollowing && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setModal({
                    buttonText: 'Unfollow',
                    warningText: `Are you sure you want to Unfollow ${fullName}?`,
                    icon: UnfollowIcon,
                    actionType: ReportActionType.Unfollow,
                  });
                  onClose!((prev) => ({ ...prev, success: false, warning: true }));
                }}
              >
                <Avatar sx={{ bgcolor: 'background.neutral' }}>
                  <Icon name="remove-unfollow" />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.primary">
                    Unfollow {fullName}
                  </Typography>
                </Box>
              </Stack>
            )}
            {!isBlocked && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setModal({
                    buttonText: 'Block',
                    warningText: `Are you sure you want to Block ${fullName}?`,
                    icon: BlockIcon,
                    actionType: ReportActionType.Block,
                  });
                  onClose!((prev) => ({ ...prev, success: false, warning: true }));
                }}
              >
                <Avatar sx={{ bgcolor: 'background.neutral' }}>
                  <Icon name="forbidden" />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.primary">
                    Block {fullName}
                  </Typography>
                </Box>
              </Stack>
            )}
          </Stack>
        </Stack>
        <Divider />
        <Stack px={2} pb={2}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
            <Box sx={{ width: 120 }}>
              <LoadingButton
                onClick={handleDone}
                sx={{ width: '100%' }}
                size="small"
                type="submit"
                variant="contained"
                color="primary"
              >
                Done
              </LoadingButton>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default ReportSuccessDialog;
