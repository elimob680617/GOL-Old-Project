import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, Stack, styled, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Icon } from 'src/components/Icon';
import { Loading } from 'src/components/loading';
import useAuth from 'src/hooks/useAuth';
import { useEndorsementSkillMutation } from 'src/_requests/graphql/profile/skills/mutations/endorsementSkill.generated';
import { useLazyGetPersonSkillsQuery } from 'src/_requests/graphql/profile/skills/queries/getPersonSkills.generated';

const SkillListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

export default function SkillListView() {
  const router = useRouter();
  const ID = router?.query?.userId?.[0];
  const auth = useAuth();

  // query
  const [getSkills, { data, isFetching }] = useLazyGetPersonSkillsQuery();
  const [updateEmdorsmentSkill, { isLoading }] = useEndorsementSkillMutation();

  useEffect(() => {
    getSkills({
      filter: {
        dto: { id: ID },
      },
    });
  }, [ID, getSkills]);

  const personSkillData = data?.getPersonSkills?.listDto?.items;
  const handleEndorse = async (data: any) => {
    const endorseRes: any = await updateEmdorsmentSkill({
      filter: {
        dto: {
          id: data,
        },
      },
    });
    if (endorseRes?.data?.endorsementSkill?.isSuccess) {
      getSkills({
        filter: {
          dto: { id: ID },
        },
      });
    }
  };

  return (
    <SkillListBoxStyle>
      <Stack direction="row" justifyContent="flex-start" mb={3} spacing={2}>
        <IconButton sx={{ padding: 0 }} onClick={() => router.back()}>
          <Icon name="left-arrow" color="grey.500" />
        </IconButton>
        <Typography variant="body1">Skills and Endorsements</Typography>
      </Stack>
      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <Box sx={{ m: 8 }}>
            <Loading />
          </Box>
        </Stack>
      ) : (
        <Stack mt={1} sx={{ pb: 3 }}>
          {personSkillData?.map((skill, index) => (
            <Box key={skill?.id}>
              <Stack sx={{ px: 2, py: 2 }} direction="row" justifyContent="space-between">
                <Stack>
                  <Stack spacing={1} direction="row">
                    <Typography variant="body2">{skill?.skill?.title}</Typography>
                    {!!skill?.endorsementsCount && (
                      <Typography color="primary.main">{skill?.endorsementsCount}</Typography>
                    )}
                  </Stack>
                  <Stack spacing={1} direction="row" alignItems="center">
                    <LoadingButton
                      variant="outlined"
                      sx={{
                        color: 'grey.900',
                        borderColor: 'grey.300',
                        py: 0.5,
                        px: 2.8,
                        mt: 1,
                      }}
                      onClick={() => handleEndorse(skill?.id as any)}
                      loading={isLoading}
                      startIcon={
                        !!skill?.people || skill?.people?.find((person) => person?.id === auth?.user?.id) ? (
                          <Icon name="Approve-Tick-1" />
                        ) : (
                          <Icon name="Plus" />
                        )
                      }
                    >
                      {/* {!!skill?.people || skill?.people?.find((person) => person?.id === auth?.user?.id) ? (
                        <TickCircle size={24} color={theme.palette.grey[700]} />
                      ) : (
                        <Add size={24} color={theme.palette.grey[700]} />
                      )} */}
                      <Typography ml={1}>
                        {skill?.people?.find((person) => person?.id === auth?.user?.id) ? 'Endorsed' : 'Endorse'}
                      </Typography>
                    </LoadingButton>
                    <Box ml={1} onClick={() => router.push(`endorsments/${skill?.id}`)}>
                      {skill?.people && skill?.people?.length > 5 && <Icon name="Plus" />}
                      <AvatarGroup spacing="small" max={5} sx={{ flexDirection: 'row', pl: 2 }}>
                        {skill?.people?.map((person, index) => (
                          <Avatar
                            alt="Remy Sharp"
                            src={person?.avatarUrl || undefined}
                            key={skill.id + index}
                            sx={{ width: 24, height: 24 }}
                          />
                        ))}
                      </AvatarGroup>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
              {index < personSkillData?.length - 1 && <Divider />}
            </Box>
          ))}
        </Stack>
      )}
    </SkillListBoxStyle>
  );
}
