import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Icon } from 'src/components/Icon';
import { ReportActionType, ReportIcon } from './ReportParentDialog';
import { ReportWarningModalProp } from './ReportWarningDialog';

interface ReportChildProps {
  reportType?: 'profile' | 'post';
  itemId?: string;
  data?:
    | ({
        id?: any;
        parentId?: any;
        rootId?: any;
        title?: string | null | undefined;
        parentTitle?: string | null | undefined;
        description?: string | null | undefined;
      } | null)[]
    | null
    | undefined;
  show: boolean;
  onClose?: Dispatch<
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

const ReportChildDialog: FC<ReportChildProps> = (props) => {
  const { data, show, onClose, setModal, setOpenDialog } = props;
  const [childId, setChildId] = useState<string | null>(null);
  const [value, setValue] = useState<
    | ({
        id?: any;
        parentId?: any;
        title?: string | null | undefined;
        description?: string | null | undefined;
      } | null)[]
    | null
    | undefined
  >(null);

  useEffect(() => {
    setValue(data);
  }, [data]);

  const handleSubmitReport = () => {
    setModal({
      buttonText: 'Report',
      warningText: 'Are you sure you want to Report this user?',
      icon: ReportIcon,
      actionType: ReportActionType.Report,
      categoryId: childId as string,
    });
    onClose!((prev) => ({ ...prev, child: false, warning: true }));
  };

  return (
    <Dialog fullWidth={true} open={show} keepMounted>
      <DialogTitle sx={{ p: 0, pb: 3 }}>
        <Stack direction="row" spacing={2} m={2} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              sx={{ p: 0 }}
              onClick={() => {
                onClose!((prev) => ({ ...prev, child: false, parent: true }));
              }}
            >
              <Icon name="left-arrow-1" color="grey.500" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {data?.[0]?.parentTitle}
            </Typography>
          </Box>
          <IconButton
            onClick={() => {
              onClose!((prev) => ({ ...prev, child: false }));
              setOpenDialog(false);
            }}
          >
            <Icon name="Close-1" color="grey.500" />
          </IconButton>
        </Stack>
        <Divider />
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Stack spacing={2} pl={2} pb={3}>
          <RadioGroup
            onChange={(e) => {
              setChildId(e.target.value);
            }}
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
          >
            {value?.map((_child, i) => (
              <Stack key={_child?.id} mb={3}>
                <FormControlLabel
                  checked={childId === _child?.id}
                  value={_child?.id}
                  control={<Radio />}
                  label={
                    <Typography variant="body1" color="text.primary">
                      {_child?.title}
                    </Typography>
                  }
                />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 4, cursor: 'default' }}>
                  {_child?.description}
                </Typography>
              </Stack>
            ))}
          </RadioGroup>
        </Stack>
        <Divider />
      </DialogContent>
      <DialogActions>
        <Button
          variant="primary"
          sx={{ width: 120, height: 32, mr: 1 }}
          onClick={handleSubmitReport}
          disabled={!childId}
        >
          {' '}
          Submit{' '}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ReportChildDialog;
