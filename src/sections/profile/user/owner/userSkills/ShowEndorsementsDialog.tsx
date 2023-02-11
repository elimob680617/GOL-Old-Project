import { LoadingButton } from '@mui/lab';
import { Dialog, IconButton, Stack, Typography, useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { CloseSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import useAuth from 'src/hooks/useAuth';
import { skillUpdated, userSkillSelector } from 'src/redux/slices/profile/userSkill-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useEndorsementSkillMutation } from 'src/_requests/graphql/profile/skills/mutations/endorsementSkill.generated';

export default function ShowEndorsementsDialog() {
  const { user, isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const personSkill = useSelector(userSkillSelector);
  const [endorsementSkill, { isLoading }] = useEndorsementSkillMutation();

  // functions !
  const handleAddEndorsement = async (id: any) => {
    const resData: any = await endorsementSkill({
      filter: {
        dto: {
          id: id,
        },
      },
    });
    if (resData?.data?.endorsementSkill?.isSuccess) {
      enqueueSnackbar('The Endorsement has been endorsement added', { variant: 'success' });
      dispatch(skillUpdated({}));
      router.push(PATH_APP.profile.user.skill.root);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={() => router.back()}>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1}>
          <Typography color="text.primary" variant="subtitle1">
            {personSkill?.skill?.title}
          </Typography>
          <Typography color="text.primary" variant="subtitle1">
            ({personSkill?.endorsementsCount})
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          {/* FIXME add primary variant to button variants */}
          {!user?.id === personSkill?.personId && (
            <LoadingButton loading={isLoading} variant="contained">
              <Typography variant="button" onClick={() => handleAddEndorsement(personSkill?.id)}>
                Add
              </Typography>
            </LoadingButton>
          )}
          <IconButton sx={{ padding: 0 }} onClick={() => router.back()}>
            <CloseSquare variant="Outline" color={theme.palette.text.primary} />
          </IconButton>
        </Stack>
      </Stack>
      <Stack spacing={2} sx={{ pb: 3 }}>
        {personSkill?.people?.map((item) => (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 2 }} key={item?.id}>
            <Avatar sx={{ width: '48px', height: '48px' }} alt="avatar" src={item?.avatarUrl || undefined} />
            <Stack>
              <Typography variant="subtitle1">{`${item?.firstName} ${item?.lastName}`}</Typography>
              <Typography color="text.secondary" variant="body2">
                {item?.headline}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Dialog>
  );
}
