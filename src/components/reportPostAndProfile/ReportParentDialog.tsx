import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Icon } from 'src/components/Icon';
import { useLazyGetReportCategoriesQuery } from 'src/_requests/graphql/profile/users/queries/getReportCategories.generated';
import ReportChildDialog from './ReportChildDialog';
import ReportSuccessDialog from './ReportSuccessDialog';
import ReportWarningDialog, { ReportWarningModalProp } from './ReportWarningDialog';

export const ReportIcon = <Icon name="Exclamation-Mark" />;
export const UnfollowIcon = <Icon name="remove-unfollow" />;
export const BlockIcon = <Icon name="forbidden" />;
export enum ReportActionType {
  Block = 'BLOCK',
  Unfollow = 'UNFOLLOW',
  Report = 'REPORT',
}
interface ReportParentProp {
  reportType: 'profile' | 'post';
  userId: string;
  postId?: string;
  fullName: string;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isFollowing: boolean;
  isBlocked: boolean;
  setIsReport?: any;
}
const ReportParentDialog: FC<ReportParentProp> = (props) => {
  const { reportType, userId, fullName, postId, openDialog, setOpenDialog, isFollowing, isBlocked, setIsReport } =
    props;
  const [parentId, setParentId] = useState<string>('');
  const [showDialog, setShowDialog] = useState<{ parent: boolean; child: boolean; success: boolean; warning: boolean }>(
    { parent: openDialog, child: false, success: false, warning: false }
  );
  const [getReportCategories, { data, isFetching, currentData }] = useLazyGetReportCategoriesQuery();

  const [modal, setModal] = useState<ReportWarningModalProp>({
    warningText: '',
    buttonText: '',
    showDialog: false,
  });

  useEffect(() => {
    if (!showDialog.parent) {
      setOpenDialog(showDialog.parent);
    }
  }, []);
  useEffect(() => {
    if (showDialog.parent) {
      getReportCategories({
        filter: {
          filterExpression: `parentId==null`,
        },
      });
    }
  }, [parentId, showDialog.parent]);

  return (
    <>
      <Dialog
        fullWidth={true}
        open={showDialog.parent}
        keepMounted
        onClose={() => {
          setOpenDialog(!showDialog.parent);
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" m={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                Report
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                setOpenDialog(!showDialog.parent);
              }}
            >
              <Icon name="Close-1" color="grey.500" />
            </IconButton>
          </Stack>
          <Divider />
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={3}>
            <Typography variant="subtitle1" color="text.primary">
              Why are you reporting?
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Your report is anonymous, except if you’re reporting an intellectual property infringement. If someone is
              in immediate danger, call the local emergency services - don’t wait.
            </Typography>
            <Stack spacing={3}>
              {isFetching ? (
                <>
                  {[...Array(currentData?.getReportCategories?.listDto?.count || 5)].map((item, index) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <Typography variant="h3">
                        <Skeleton variant="text" width={250} animation="wave" />
                      </Typography>
                    </Stack>
                  ))}
                </>
              ) : (
                <>
                  {data?.getReportCategories?.listDto?.items?.map((category) => (
                    <Stack key={category?.id} direction="row" alignItems="center" justifyContent="space-between">
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          setParentId(category?.id);
                          setShowDialog((prev) => ({ ...prev, child: true, parent: false }));
                          getReportCategories({
                            filter: {
                              filterExpression: `parentId== \"${category?.id}\"`,
                            },
                          });
                        }}
                      >
                        {category?.title}
                      </Typography>
                      <IconButton
                        disabled={isFetching}
                        onClick={() => {
                          setParentId(category?.id);
                          setShowDialog((prev) => ({ ...prev, child: true, parent: false }));
                          getReportCategories({
                            filter: {
                              filterExpression: `parentId== \"${category?.id}\"`,
                            },
                          });
                        }}
                      >
                        <Icon name="right-arrow-1" />
                      </IconButton>
                    </Stack>
                  ))}
                </>
              )}
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
      {!!parentId && !isFetching && (
        <ReportChildDialog
          reportType={reportType}
          itemId={userId}
          data={data?.getReportCategories?.listDto?.items}
          show={showDialog.child as boolean}
          onClose={setShowDialog}
          setModal={setModal}
          setOpenDialog={setOpenDialog}
        />
      )}
      {showDialog.warning && (
        <ReportWarningDialog
          setIsReport={setIsReport}
          reportType={reportType}
          userId={userId}
          postId={postId}
          showDialog={showDialog.warning}
          buttonText={modal.buttonText}
          warningText={modal.warningText}
          icon={modal.icon}
          actionType={modal.actionType}
          onClose={setShowDialog}
          fromReport
        />
      )}

      {showDialog.success && (
        <ReportSuccessDialog
          isFollowing={isFollowing}
          isBlocked={isBlocked}
          fullName={fullName}
          showDialog={showDialog.success}
          onClose={setShowDialog}
          setModal={setModal}
          setOpenDialog={setOpenDialog}
        />
      )}
    </>
  );
};

export default ReportParentDialog;
