import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { AudienceEnum, FeatureAudienceEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import LimitFollowersDialog from './LimitFollowersDialog';

interface AudienceParentProp {
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  feature: FeatureAudienceEnum;
  value: AudienceEnum;
  onChange: (value: AudienceEnum) => void;
}
const AudienceMainDialog = (props: AudienceParentProp) => {
  const { open, onClose, feature, value, onChange } = props;
  const [show, setShow] = useState<{ parent: boolean; child: boolean; warning: boolean }>({
    parent: true,
    child: false,
    warning: false,
  });
  const [audienceType, setAudienceType] = React.useState<AudienceEnum>();
  // const handleLimitFollower = () => {
  //   setShow((prev) => ({ ...prev, child: true, parent: false }));
  //   // onClose!(false);
  // };

  return (
    <>
      <Dialog fullWidth={true} open={open && show.parent} keepMounted onClose={() => {}}>
        <DialogTitle sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              sx={{ p: 0 }}
              onClick={() => {
                onClose!(false);
              }}
            >
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Audience
            </Typography>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack>
            <FormControl>
              <RadioGroup
                onChange={(e) => {
                  const val = (e.target as HTMLInputElement).value as AudienceEnum;
                  onChange(val);
                  if (val === AudienceEnum.ExceptFollowes || val === AudienceEnum.SpecificFollowes) {
                    setAudienceType(val);
                    setShow((prev) => ({ ...prev, child: true, parent: false }));
                  } else {
                    onClose(false);
                  }
                }}
                value={value}
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
              >
                <FormControlLabel value={AudienceEnum.Public} control={<Radio />} label={'Public'} />
                <FormControlLabel value={AudienceEnum.Private} control={<Radio />} label={'Private'} />
                <FormControlLabel value={AudienceEnum.OnlyMe} control={<Radio />} label={'Only me'} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack>
                    <FormControlLabel
                      value={AudienceEnum.SpecificFollowes}
                      control={<Radio />}
                      label={'Specific followers'}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 3, mb: 1, cursor: 'default' }}>
                      Select Specific followers as your audience
                    </Typography>
                  </Stack>
                  <IconButton
                    onClick={() => {
                      setShow((prev) => ({ ...prev, child: true, parent: false }));
                      setAudienceType(AudienceEnum.SpecificFollowes);
                    }}
                  >
                    <Icon name="right-arrow-1" />
                  </IconButton>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack>
                    <FormControlLabel
                      value={AudienceEnum.ExceptFollowes}
                      control={<Radio />}
                      label={'All followers except'}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 3, mb: 1, cursor: 'default' }}>
                      Select followers that you dont want as an audience
                    </Typography>
                  </Stack>
                  <IconButton
                    onClick={() => {
                      setShow((prev) => ({ ...prev, child: true, parent: false }));
                      setAudienceType(AudienceEnum.ExceptFollowes);
                    }}
                  >
                    <Icon name="right-arrow-1" />
                  </IconButton>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Stack>
        </DialogContent>
      </Dialog>
      {(show.child || show.warning) && (
        <LimitFollowersDialog
          open={show.child}
          discardShow={show.warning}
          handleShow={setShow}
          feature={feature}
          audienceType={audienceType as AudienceEnum}
          onChange={onChange}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default AudienceMainDialog;
