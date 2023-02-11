import { Avatar, Box, Divider, IconButton, Stack, styled, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Icon } from 'src/components/Icon';
import { Loading } from 'src/components/loading';
import { useLazyGetEndorsementsQuery } from 'src/_requests/graphql/profile/skills/queries/getEndorsements.generated';

const EndorsListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));
export default function EndorsmentsView() {
  const router = useRouter();
  const skillId = router?.query?.userId?.[0];
  const [getEndorsments, { data, isFetching }] = useLazyGetEndorsementsQuery();
  useEffect(() => {
    getEndorsments({
      filter: { dto: { personSkillId: skillId } },
    });
  }, [getEndorsments, skillId]);
  const EndorsmentsPeople = data?.getEndorsements?.listDto?.items;

  return (
    <EndorsListBoxStyle>
      <Stack direction="row" justifyContent="flex-start" mb={3} spacing={2}>
        <IconButton sx={{ padding: 0 }} onClick={() => router.back()}>
          <Icon name="left-arrow" color="grey.500" />
        </IconButton>
        <Typography variant="body1">Endorsed By</Typography>
      </Stack>
      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <Box sx={{ m: 8 }}>
            <Loading />
          </Box>
        </Stack>
      ) : (
        <Stack mt={1} sx={{ pb: 3 }}>
          {EndorsmentsPeople?.map((endorsBy, index) => (
            <Box key={endorsBy?.id}>
              <Stack sx={{ px: 2, py: 2 }} direction="row" justifyContent="space-between">
                <Stack spacing={1} direction="row" alignItems="center">
                  {/* onClick={() => handleRouting(endorsBy?.id)} */}
                  <Avatar alt="Remy Sharp" src={endorsBy?.avatarUrl || undefined} sx={{ width: 48, height: 48 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {(endorsBy?.firstName || endorsBy?.lastName) && (
                      <Typography variant="body2">
                        {endorsBy?.firstName} {endorsBy?.lastName}
                      </Typography>
                    )}
                    {endorsBy?.headline && <Typography variant="body2">{endorsBy?.headline}</Typography>}
                  </Box>
                </Stack>
              </Stack>
              {index < EndorsmentsPeople?.length - 1 && <Divider />}
            </Box>
          ))}
        </Stack>
      )}
    </EndorsListBoxStyle>
  );
}
