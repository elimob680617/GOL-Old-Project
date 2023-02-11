import { FC } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

interface IConfirmDialogProps extends DialogProps {
  actionButtonText: string;
  titleText: string;
  confirmText: string;
  confirmationResultText?: string;
  confirm: () => void;
  loading?: boolean;
}

const ConfirmDialog: FC<IConfirmDialogProps> = (props) => {
  const { titleText, confirmText, confirmationResultText, onClose, actionButtonText, confirm, loading } = props;
  return (
    <Dialog maxWidth="xs" fullWidth={true} {...props}>
      <DialogTitle>
        <Typography>{titleText}</Typography>
      </DialogTitle>

      <DialogContent>
        <Grid mt={2} container alignItems="flex-end" xs={12}>
          {confirmText}
        </Grid>

        <Typography mt={2} variant="subtitle2" color="gray">
          {confirmationResultText || ''}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button autoFocus variant="text" color="error" onClick={(event) => onClose!(event, 'backdropClick')}>
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          loadingPosition="start"
          variant="text"
          onClick={() => {
            confirm();
            onClose!({}, 'backdropClick');
          }}
        >
          {actionButtonText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
