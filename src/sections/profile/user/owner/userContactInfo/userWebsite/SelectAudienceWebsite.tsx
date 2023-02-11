import { Dialog, Stack, Typography, IconButton, Divider, useTheme, FormControl, FormControlLabel } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'src/redux/store';
import { ArrowLeft, CloseSquare } from 'iconsax-react';
import { useUpsertWebsiteMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertWebsite.generated';
import { websiteAdded, websiteCleared, userWebsiteSelector } from 'src/redux/slices/profile/userWebsite-slice';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { PATH_APP } from 'src/routes/paths';

export default function SelectAudienceWebsite() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const userWebsite = useSelector(userWebsiteSelector);
  const { enqueueSnackbar } = useSnackbar();
  const [upsertUserWebsite] = useUpsertWebsiteMutation();

  const handleUpdateAudience = async (val) => {
    const resAudi: any = await upsertUserWebsite({
      filter: {
        dto: {
          webSiteUrl: userWebsite?.webSiteUrl,
          id: userWebsite?.id,
          audience: val as AudienceEnum,
        },
      },
    });
    console.log('resAudi', resAudi);
    if (resAudi?.data?.upsertUserWebsite?.isSuccess) {
      enqueueSnackbar('The audience has been successfully edited', { variant: 'success' });
      dispatch(websiteCleared());
    }
  };

  useEffect(() => {
    if (!userWebsite) router.push(PATH_APP.profile.user.contactInfo.root);
  }, [userWebsite, router]);

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
          <IconButton>
            <CloseSquare variant="Outline" onClick={() => router.back()} />
          </IconButton>
        </Stack>
        <Divider />
        <Stack>
          <FormControl sx={{ mb: 2 }}>
            <RadioGroup
              onChange={(e) => {
                dispatch(
                  websiteAdded({
                    ...userWebsite,
                    audience: (e.target as HTMLInputElement).value as AudienceEnum,
                  })
                );
                if (userWebsite?.id) handleUpdateAudience((e.target as HTMLInputElement).value);
                router.back();
              }}
              value={userWebsite?.audience}
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
