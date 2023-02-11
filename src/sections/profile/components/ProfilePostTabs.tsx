//mui
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, CircularProgress, Stack, Tab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { default as Link } from 'next/link';
import { useRouter } from 'next/router';
import NoPostIcon from 'public/icons/noPost.svg';
import React, { FC, useEffect, useMemo } from 'react';
import { PATH_APP } from 'src/routes/paths';
import CampaignPost from 'src/sections/post/campaignPost/campignPostCard/CampignPost';
import SocialPost from 'src/sections/post/socialPost/SocialPostCard/socialPost';
import { useLazyGetHomePagePostsQuery } from 'src/_requests/graphql/post/queries/getHomePagePosts.generated';

interface UserPost {
  // ID?: string;
  Name?: string;
}

const LoadMoreStyle = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
}));
const PostStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));
const PostStyleNoPost = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 1,
  padding: theme.spacing(2),
}));

const ProfilePostTabs: FC<UserPost> = (props) => {
  const { Name } = props;
  const router = useRouter();
  const [value, setValue] = React.useState('Post');
  const userId = router?.query?.id?.[0];
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [getPosts, { isLoading: getPostsLoading, data: postsData }] = useLazyGetHomePagePostsQuery();
  useEffect(() => {
    getPosts({ filter: { pageIndex: 0, pageSize: 1, dto: { ownerUserId: userId } } });
  }, [getPosts, userId]);

  const posts = postsData?.getHomePagePosts?.listDto?.items;
  const count = postsData?.getHomePagePosts?.listDto?.count;

  //................................................
  const renderPosts = useMemo(
    () => (
      <Stack spacing={2} sx={{ flex: 1 }}>
        {getPostsLoading ? (
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
          posts?.map((post) =>
            post?.social ? (
              <SocialPost key={post?.social?.id} post={post?.social} page="search" />
            ) : (
              <CampaignPost key={post?.campaign?.id} post={post?.campaign} />
            )
          )
        )}
      </Stack>
    ),

    [getPostsLoading, posts]
  );
  //................
  const renderPost = useMemo(
    () => (
      <>
        {count > 0 ? (
          <>
            <PostStyle>{renderPosts}</PostStyle>
            {count > 1 && (
              <>
                <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 24, ml: -2 }} />
                <PostStyle>
                  <Link href={PATH_APP.profile.post.root + '/' + userId} passHref>
                    <LoadMoreStyle>
                      <Typography variant="body2" color={'primary.main'} sx={{ cursor: 'pointer' }}>
                        See More Post
                      </Typography>
                    </LoadMoreStyle>
                  </Link>
                </PostStyle>
              </>
            )}
          </>
        ) : (
          <>
            <PostStyleNoPost direction="column" spacing={3}>
              {/* <Box sx={{ typography: 'body1', display: 'flex', justifyContent: 'space-between' }}></Box> */}
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Image src={NoPostIcon} alt="" />
                <Box sx={{ display: 'flex' }} mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    {Name} have no Post
                  </Typography>
                </Box>
              </Box>
            </PostStyleNoPost>
          </>
        )}
      </>
    ),

    [count, Name]
  );

  return (
    <>
      <PostStyle justifyContent="space-between" direction="row">
        <Box sx={{ width: '100%' }}>
          <TabContext value={value}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Posts  " value="Post" />
                <Tab label="Articles" value="Article" />
                <Tab label="Mentioned" value="Mention" />
              </TabList>
            </Box>
            {posts && posts?.length > 0 && (
              <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 24, ml: -2 }} />
            )}
            <TabPanel value="Post">{renderPost}</TabPanel>
            <TabPanel value="Article">{renderPost}</TabPanel>
            <TabPanel value="Mention">{renderPost}</TabPanel>
          </TabContext>
        </Box>
      </PostStyle>
    </>
  );
};

export default ProfilePostTabs;
