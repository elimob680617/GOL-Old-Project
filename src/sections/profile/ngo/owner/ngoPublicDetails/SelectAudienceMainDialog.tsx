import { Dialog, Divider, FormControl, FormControlLabel, IconButton, Stack, Typography, useTheme } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { AudienceEnum, OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';

export default function SelectAudienceMainDialog() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [upsertPublicAudienceNgoUser] = useUpdateOrganizationUserFieldMutation();

  const handelJoinAudience = async (value) => {
    console.log('value', value);
    const resAudi: any = await upsertPublicAudienceNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.JoinDateAudience,
          joinAudience: value,
        },
      },
    });
    if (resAudi?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar('Join Audience Updated', { variant: 'success' });
      router.back();
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ pt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={() => router.back()}>
              <Icon name="left-arrow" />
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
              onChange={(e) => handelJoinAudience((e.target as HTMLInputElement).value)}
              value={router.query.audience}
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
              <Typography variant="caption" color="text.secondary" sx={{ ml: 6, mb: 1 }}>
                Select Specific followers as your audience
              </Typography>

              <FormControlLabel
                value={AudienceEnum.ExceptFollowes}
                control={<Radio />}
                label={'All followers except'}
                sx={{ ml: '8px !important', mt: '8px !important' }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 6, mb: 1 }}>
                Select followers that you dont want as an audience
              </Typography>
            </RadioGroup>
          </FormControl>
        </Stack>
      </Stack>
    </Dialog>
  );
}
