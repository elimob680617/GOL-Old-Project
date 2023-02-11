import { FC } from 'react';
import { Box, Dialog, Divider, IconButton, Stack, Typography, useTheme, Button } from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { StateType } from './PopOverChecker';

const WarningDialog: FC<StateType> = ({ show, icon, onClose, actionFn, warningText, buttonText, actionType }) => {
  const theme = useTheme();
  return (
    <Dialog
      fullWidth={true}
      open={show}
      keepMounted
      onClose={() =>
        onClose!({
          warningText: '',
          buttonText: '',
          show: false,
        })
      }
    >
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              {warningText}
            </Typography>
          </Box>
          <IconButton
            onClick={() =>
              onClose!({
                warningText: '',
                buttonText: '',
                show: false,
              })
            }
          >
            <CloseCircle />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={1} px={2} sx={{ alignItems: 'flex-start' }}>
          <Button
            onClick={() => actionFn!(actionType!)}
            variant="text"
            size="large"
            startIcon={icon}
            sx={{
              height: 32,
              justifyContent: 'stretch',
              color: theme.palette.error.main,
            }}
          >
            {buttonText}
          </Button>
          <Button
            onClick={() =>
              onClose!({
                warningText: '',
                buttonText: '',
                show: false,
              })
            }
            variant="text"
            size="large"
            startIcon={<CloseCircle />}
            sx={{
              justifyContent: 'stretch',
              height: 32,
              color: theme.palette.text.primary,
            }}
          >
            Discard
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default WarningDialog;
