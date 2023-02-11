import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { RequestEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { useUpdateConnectionMutation } from 'src/_requests/graphql/connection/mutations/updateConnection.generated';
import { useReportPostMutation } from 'src/_requests/graphql/post/reportPost/mutations/reportPost.generated';
import { useReportUserMutation } from 'src/_requests/graphql/profile/reportProfile/mutations/reportUser.generated';
import { ReportActionType } from './ReportParentDialog';

export interface ReportWarningModalProp {
  reportType?: 'profile' | 'post';
  showDialog?: boolean;
  fromReport?: boolean;
  userId?: string;
  postId?: string;
  categoryId?: string;
  onCloseBlock?: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: Dispatch<
    SetStateAction<{
      parent: boolean;
      child: boolean;
      success: boolean;
      warning: boolean;
    }>
  >;
  actionType?: ReportActionType | RequestEnum;
  warningText: string;
  buttonText: string;
  icon?: ReactNode;
  setIsReport?: any;
}

const ReportWarningDialog: FC<ReportWarningModalProp> = (props) => {
  const {
    showDialog,
    setIsReport,
    onClose,
    userId,
    postId,
    reportType,
    actionType,
    categoryId,
    buttonText,
    warningText,
    fromReport,
    onCloseBlock,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [reportUserProfile, { isLoading: isReportProfileLoading }] = useReportUserMutation();
  const [reportPost, { isLoading: isReportPostLoading }] = useReportPostMutation();
  const [changeStatus, { isLoading: isActionLoading }] = useUpdateConnectionMutation();

  const handleClick = () => {
    if (actionType === ReportActionType.Report) {
      switch (reportType) {
        case 'profile':
          handleReportProfile();
          break;
        case 'post':
          handleReportPost();
          break;

        default:
          break;
      }
    } else {
      handleAction();
    }
  };

  const handleReportProfile = async () => {
    const res: any = await reportUserProfile({
      filter: {
        dto: {
          userId,
          reportProfileCategoryId: categoryId as string,
        },
      },
    });
    if (res?.data?.reportUser?.isSuccess) {
      onClose!((prev: any) => ({ ...prev, warning: false, success: true }));
    } else {
      enqueueSnackbar(`${res?.data?.reportUser?.messagingKey}`, { variant: 'error' });
    }
  };

  const handleReportPost = async () => {
    const res: any = await reportPost({
      reportPost: {
        dto: {
          postId,
          reportCategoryId: categoryId as string,
        },
      },
    });
    if (res?.data?.reportPost?.isSuccess) {
      onClose!((prev: any) => ({ ...prev, warning: false, success: true }));
      setIsReport(true);
    } else {
      enqueueSnackbar(`${res?.data?.reportPost?.messagingKey}`, { variant: 'error' });
    }
  };

  const handleAction = async () => {
    const res: any = await changeStatus({
      filter: {
        dto: {
          itemId: userId,
          actionType: actionType as RequestEnum,
        },
      },
    });
    if (res?.data?.updateConnection?.isSuccess) {
      if (!fromReport) {
        onCloseBlock!(false);
      } else {
        onClose!((prev: any) => ({ ...prev, warning: false }));
      }
    } else {
      enqueueSnackbar(`${res?.data?.updateConnection?.messagingKey}`, { variant: 'error' });
    }
  };

  const handleDiscard = () => {
    switch (actionType) {
      case ReportActionType.Report:
        onClose!((prev: any) => ({ ...prev, warning: false, child: true }));
        break;
      case ReportActionType.Block:
        if (fromReport) {
          onClose!((prev: any) => ({ ...prev, warning: false, success: true }));
        } else {
          onCloseBlock!(false);
        }
        break;
      case ReportActionType.Unfollow:
        onClose!((prev: any) => ({ ...prev, warning: false, success: true }));
        break;

      default:
        break;
    }
  };

  return (
    <Dialog fullWidth={true} open={showDialog as boolean} keepMounted>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              {warningText}
            </Typography>
          </Box>
          <IconButton onClick={handleDiscard}>
            <Icon name="Close-1" color="grey.500" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
            <LoadingButton
              onClick={handleClick}
              loading={isActionLoading || isReportPostLoading || isReportProfileLoading}
              startIcon={<Icon name="Exclamation-Mark" color="error.main" />}
            >
              <Typography variant="body2" color="error">
                {buttonText}
              </Typography>
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <LoadingButton
              onClick={handleDiscard}
              sx={{ color: 'surface.onSurface' }}
              startIcon={<Icon name="Close-1" color="grey.500" />}
            >
              <Typography variant="body2">Discard</Typography>
            </LoadingButton>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default ReportWarningDialog;
