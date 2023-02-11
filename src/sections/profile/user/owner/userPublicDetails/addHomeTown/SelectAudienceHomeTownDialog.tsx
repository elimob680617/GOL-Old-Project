import { Dialog, Stack, Typography, IconButton, Divider, FormControl, FormControlLabel, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'src/redux/store';
import { ArrowLeft, CloseSquare } from 'iconsax-react';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { userLocationUpdated, userLocationSelector } from 'src/redux/slices/profile/userLocation-slice';

export default function SelectAudienceHomeTownDialog() {
  const router = useRouter();
  const theme = useTheme();

  const dispatch = useDispatch();

  const userCity = useSelector(userLocationSelector);

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ pt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton>
            Privacy
          </Typography>
          <IconButton onClick={() => router.back()}>
            <CloseSquare variant="Outline" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack>
          <FormControl sx={{ mb: 2 }}>
            <RadioGroup
              onChange={(e) => {
                dispatch(
                  userLocationUpdated({
                    id: userCity?.id,
                    city: userCity?.city,
                    audience: (e.target as HTMLInputElement).value as AudienceEnum,
                    isChange: true,
                  })
                );
                router.back();
              }}
              value={userCity?.audience}
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
            >
              <FormControlLabel
                value={AudienceEnum.Public}
                control={<Radio />}
                label={'Public'}
                sx={{ ml: '8px !important', mt: '8px !important' }}
              />
              <FormControlLabel
                value={AudienceEnum.Private}
                control={<Radio />}
                label={'Private'}
                sx={{ ml: '8px !important', mt: '8px !important' }}
              />
              <FormControlLabel
                value={AudienceEnum.OnlyMe}
                control={<Radio />}
                label={'Only me'}
                sx={{ ml: '8px !important', mt: '8px !important' }}
              />
              <FormControlLabel
                value={AudienceEnum.SpecificFollowes}
                control={<Radio />}
                label={'Specific followers'}
                sx={{ ml: '8px !important', mt: '8px !important' }}
              />
              <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 6, mb: 1 }}>
                Select Specific followers as your audience
              </Typography>

              <FormControlLabel
                value={AudienceEnum.ExceptFollowes}
                control={<Radio />}
                label={'All followers except'}
                sx={{ ml: '8px !important', mt: '8px !important' }}
              />
              <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 6, mb: 1 }}>
                Select followers that you dont want as an audience
              </Typography>
            </RadioGroup>
          </FormControl>
        </Stack>
      </Stack>
    </Dialog>
  );
}
