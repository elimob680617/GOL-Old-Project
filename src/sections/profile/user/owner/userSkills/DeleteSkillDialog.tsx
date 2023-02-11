import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, CloseSquare, Save2, Trash } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { skillUpdated, userSkillSelector } from 'src/redux/slices/profile/userSkill-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useDeletePersonSkillMutation } from 'src/_requests/graphql/profile/skills/mutations/deletePersonSkill.generated';

export default function DeleteSkillDialog() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const personskill = useSelector(userSkillSelector);
  const router = useRouter();
  const theme = useTheme();
  const [deletePersonSkill, { isLoading }] = useDeletePersonSkillMutation();
  // mutations !
  const handleDeleteSkill = async () => {
    const resDeleteDate: any = await deletePersonSkill({
      filter: {
        dto: {
          id: personskill?.id,
        },
      },
    });
    if (resDeleteDate?.data?.deletePersonSkill?.isSuccess) {
      enqueueSnackbar('The skill has been successfully deleted', { variant: 'success' });
      dispatch(skillUpdated({}));
      router.push(PATH_APP.profile.user.skill.root);
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };

  // click on Diskard and go to list
  const handleDiscardSkill = () => {
    dispatch(skillUpdated({}));
    router.push(PATH_APP.profile.user.skill.root);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              Are you sure to delete this Skill?
            </Typography>
          </Box>
          <Link href={PATH_APP.profile.user.root} passHref>
            <IconButton>
              <CloseSquare />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }} alignItems="start">
          <LoadingButton
            loading={isLoading}
            startIcon={<Trash size="24" color={theme.palette.error.main} variant="Outline" />}
            variant="text"
            color="inherit"
            onClick={handleDeleteSkill}
          >
            <Typography variant="body2" color="error">
              Delete Skill
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="inherit"
            startIcon={<Save2 fontSize="24" variant="Outline" />}
            onClick={handleDiscardSkill}
          >
            <Typography variant="body2" color="text.primary">
              Discard
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
