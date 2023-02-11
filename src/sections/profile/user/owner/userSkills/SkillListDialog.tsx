import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Add, CloseSquare, Trash } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { skillUpdated } from 'src/redux/slices/profile/userSkill-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useLazyGetPersonSkillsQuery } from '../../../../../_requests/graphql/profile/skills/queries/getPersonSkills.generated';

const NoResultStyle = styled(Stack)(({ theme }) => ({
  maxWidth: 164,
  maxHeight: 164,
  width: 164,
  height: 164,
  background: theme.palette.grey[100],
  borderRadius: '100%',
}));

export default function SkillListDialog() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();

  // query
  const [getSkills, { data, isFetching }] = useLazyGetPersonSkillsQuery();

  useEffect(() => {
    getSkills({
      filter: {
        dto: {},
      },
    });
  }, []);

  const personSkillData = data?.getPersonSkills?.listDto?.items;

  // navigate and send data to Redux
  const handleNavigation = (url: string, personSkill: any) => {
    dispatch(skillUpdated(personSkill));
    router.push(url);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={() => router.push(PATH_APP.profile.user.root)}>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1">Skills and Endorsements</Typography>
        <Stack direction="row" spacing={2}>
          {/* FIXME add primary variant to button variants */}
          {!!personSkillData?.length && (
            <Button variant="contained" onClick={() => router.push(PATH_APP.profile.user.skill.searchSkill)}>
              <Typography variant="button">Add</Typography>
            </Button>
          )}
          <IconButton sx={{ padding: 0 }} onClick={() => router.push(PATH_APP.profile.user.root)}>
            <CloseSquare variant="Outline" color={theme.palette.text.primary} />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />
      {isFetching ? (
        <CircularProgress sx={{ m: 8 }} />
      ) : !personSkillData?.length ? (
        <Stack sx={{ py: 6, minHeight: '390px' }} alignItems="center" justifyContent="center">
          <NoResultStyle alignItems="center" justifyContent="center">
            <Typography variant="subtitle1" sx={{ color: (theme) => 'text.secondary', textAlign: 'center' }}>
              No result
            </Typography>
          </NoResultStyle>
          <Box sx={{ mt: 3 }} />
          <Link href={PATH_APP.profile.user.skill.searchSkill} passHref>
            <Button variant="text" startIcon={<Add variant="Outline" color={theme.palette.info.main} />}>
              <Typography color="info.main">Add Skills and Endorsements</Typography>
            </Button>
          </Link>
        </Stack>
      ) : (
        <Stack mt={1} sx={{ pb: 3 }}>
          {personSkillData?.map((item) => (
            <Box key={item?.id}>
              <Stack sx={{ px: 2, py: 2 }} direction="row" justifyContent="space-between">
                <Stack>
                  <Stack spacing={1} direction="row">
                    <Typography
                      variant="body2"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleNavigation(PATH_APP.profile.user.skill.endorsments, item)}
                    >
                      {item?.skill?.title}
                    </Typography>
                    {!!item?.endorsementsCount && <Typography color="green">{item?.endorsementsCount}</Typography>}
                  </Stack>
                  <AvatarGroup spacing="small" max={5} sx={{ flexDirection: 'row', pl: 2 }}>
                    {item?.people?.map((person, index) => (
                      <Avatar alt="Remy Sharp" src={person?.avatarUrl || undefined} key={item.id + index} />
                    ))}
                  </AvatarGroup>
                </Stack>
                <Trash
                  variant="Outline"
                  onClick={() => handleNavigation(PATH_APP.profile.user.skill.delete, item)}
                  style={{ cursor: 'pointer' }}
                />
              </Stack>
              <Divider />
            </Box>
          ))}
        </Stack>
      )}
    </Dialog>
  );
}
