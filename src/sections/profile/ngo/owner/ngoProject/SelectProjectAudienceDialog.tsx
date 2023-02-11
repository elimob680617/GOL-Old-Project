import { Dialog, Divider, FormControl, FormControlLabel, IconButton, Stack, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { ngoProjectSelector, projectAdded } from 'src/redux/slices/profile/ngoProject-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';

export default function SelectProjectAudienceDialog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const projectData = useSelector(ngoProjectSelector);

  const handleUpdateAudience = async (val) => {
    dispatch(
      projectAdded({
        audience: val,
        isChange: true,
      })
    );
    router.back();
  };

  useEffect(() => {
    if (!projectData) router.push(PATH_APP.profile.ngo.project.list);
  }, [projectData, router]);

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ pt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={() => router.back()}>
              <Icon name="left-arrow-1" />
            </IconButton>
            Privacy
          </Typography>
          <IconButton onClick={() => router.back()}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack>
          <FormControl sx={{ mb: 2 }}>
            <RadioGroup
              onChange={(e) => {
                handleUpdateAudience((e.target as HTMLInputElement).value);
              }}
              value={projectData?.audience}
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
            >
              {Object.keys(AudienceEnum).map((_audience) => (
                <>
                  <FormControlLabel
                    value={AudienceEnum[_audience]}
                    key={_audience}
                    control={<Radio />}
                    label={_audience}
                    sx={{ ml: '8px !important', mt: '8px !important' }}
                  />
                  {_audience == 'SpecificFollowes' && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 6, mb: 1 }}>
                      Select Specific followers as your audience
                    </Typography>
                  )}
                  {_audience == 'ExceptFollowes' && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 6, mb: 1 }}>
                      Select followers that you dont want as an audience
                    </Typography>
                  )}
                </>
              ))}
            </RadioGroup>
          </FormControl>
        </Stack>
      </Stack>
    </Dialog>
  );
}
