import { Box, CircularProgress, Divider, IconButton, Stack, styled, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Icon } from 'src/components/Icon';
import MediaCarousel from 'src/components/mediaCarousel';
import getMonthName from 'src/utils/getMonthName';
import { useLazyGetProjectsQuery } from 'src/_requests/graphql/profile/mainProfileNOG/queries/getProject.generated';

const ExperienceWrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
}));
const ExperienceListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

const ExperienceBriefDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
}));
const ExperienceMoreDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));

function ProjectListView() {
  const router = useRouter();
  const ID = router?.query?.userId?.[0];
  const [isSeeMore, setIsLoadMore] = useState<Record<string, boolean>>({});

  const [getProjects, { data, isFetching }] = useLazyGetProjectsQuery();

  useEffect(() => {
    getProjects({
      filter: {
        dto: { userId: ID },
      },
    });
  }, []);

  const projects = data?.getProjects?.listDto?.items;

  const handleSeeMoreClick = (key: string) => {
    setIsLoadMore({ ...isSeeMore, [key]: true });
  };

  const showDifferenceExp = (year: number, month: number) => {
    if (year === 0 && month === 0) return null;
    let finalValue = '';

    if (year > 0) finalValue = `${year} Year${year > 1 ? 's' : ''}  `;
    if (finalValue && month) finalValue += 'and ';
    if (month > 0) finalValue += ` ${month} Month${month > 1 ? 's' : ''}`;
    return <span>&#8226; {finalValue}</span>;
  };

  return (
    <ExperienceListBoxStyle>
      <Stack direction="row" justifyContent="flex-start" mb={3} spacing={2}>
        <IconButton sx={{ padding: 0 }} onClick={() => router.back()}>
          <Icon name="left-arrow" color="grey.500" />
        </IconButton>
        <Typography variant="body1">Project</Typography>
      </Stack>

      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : (
        projects?.map((project, index) => (
          <Box key={project?.id}>
            <ExperienceWrapperStyle spacing={1} direction="row">
              <Stack sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ color: 'primary.dark' }}>
                    {project?.title}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  {getMonthName(new Date(project?.startDate)) +
                    ' ' +
                    new Date(project?.startDate).getFullYear() +
                    ' - ' +
                    (project?.endDate
                      ? getMonthName(new Date(project?.endDate)) + ' ' + new Date(project?.endDate).getFullYear()
                      : 'Present')}{' '}
                  {showDifferenceExp(project?.dateDiff?.years as number, project?.dateDiff?.months as number)}
                </Typography>
                {project?.cityDto && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                    {project?.cityDto?.name}
                  </Typography>
                )}
                {project?.description && (
                  <>
                    {!isSeeMore[project?.id] &&
                    (project?.description?.length > 210 || project?.description.split('\n')?.length > 3) ? (
                      <>
                        <ExperienceBriefDescriptionStyle variant="body2">
                          {project?.description?.split('\n').map((str, i) => (
                            <p key={i}>{str}</p>
                          ))}
                        </ExperienceBriefDescriptionStyle>
                        <Typography
                          variant="body2"
                          color="info.main"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleSeeMoreClick(project?.id)}
                        >
                          see more
                        </Typography>
                      </>
                    ) : (
                      <ExperienceMoreDescriptionStyle>
                        {project?.description.split('\n').map((str, i) => (
                          <p key={i}>{str}</p>
                        ))}
                      </ExperienceMoreDescriptionStyle>
                    )}
                  </>
                )}
                {!!project?.projectMedias?.length && (
                  <Box sx={{ py: 2 }}>
                    <MediaCarousel media={project?.projectMedias} dots height={184} width={328} />
                  </Box>
                )}
              </Stack>
            </ExperienceWrapperStyle>
            {index < projects?.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </ExperienceListBoxStyle>
  );
}

export default ProjectListView;
