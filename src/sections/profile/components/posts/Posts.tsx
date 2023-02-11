// @mui
// sections
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Container, IconButton, Stack, Tab, Typography, useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/router';
import leftArrow from 'public/icons/left arrow/24/Outline.svg';
import React, { useEffect, useMemo } from 'react';
import Ads from 'src/sections/home/Ads';
import GoPremium from 'src/sections/home/GoPremium';
import Helpers from 'src/sections/home/Helpers';
import Menu from 'src/sections/home/Menu';
import MyConnectionsDonors from 'src/sections/home/MyConnectionsDonors';
import Tops from 'src/sections/home/Tops';
import CampignPost from 'src/sections/post/campaignPost/campignPostCard/CampignPost';
import SocialPost from 'src/sections/post/socialPost/SocialPostCard/socialPost';
import { useLazyGetHomePagePostsQuery } from 'src/_requests/graphql/post/queries/getHomePagePosts.generated';

// import SocialPostCreateDialog from 'src/sections/post/create-post/SocialPostCreateDialog';
// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  paddingTop: theme.spacing(3),
}));
const PostStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 1,
  padding: theme.spacing(2),
}));
// ----------------------------------------------------------------------

export default function Posts() {
  const theme = useTheme();
  const router = useRouter();
  const userId = router?.query?.userId?.[0];
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { query } = useRouter();

  const [getHomePagePosts, { isLoading: getPostsLoading, data: postsData }] = useLazyGetHomePagePostsQuery();

  useEffect(() => {
    getHomePagePosts({ filter: { pageIndex: 0, pageSize: 10, dto: { ownerUserId: userId as string } } });
  }, [getHomePagePosts, userId]);

  const posts = postsData?.getHomePagePosts?.listDto?.items;

  const renderPostsMemo = useMemo(
    () => (
      <Stack spacing={2}>
        <PostStyle>
          <Stack direction="row" alignItems="center" justifyContent="start" spacing={3}>
            <IconButton onClick={() => router.back()}>
              <Image src={leftArrow} alt="back" />
            </IconButton>
            <Typography variant="body1" color={theme.palette.text.primary}>
              Posts
            </Typography>
          </Stack>
        </PostStyle>
        <PostStyle justifyContent="space-between" direction="row">
          <Box>
            <TabContext value={value}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Posts" value="1" />
                  <Tab label="Fundraisings" value="2" />
                  <Tab label="Articles" value="3" />
                  <Tab label="Mentioned" value="4" />
                </TabList>
              </Box>
              <TabPanel value="1">
                {getPostsLoading ? (
                  <Stack alignItems="center">
                    <CircularProgress />
                  </Stack>
                ) : (
                  posts?.map((post) => (
                    <>
                      <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 24, ml: -2 }} />

                      {post?.social ? (
                        <SocialPost key={post?.social?.id} post={post?.social} page="home" />
                      ) : (
                        <CampignPost key={post?.campaign?.id} post={post?.campaign} />
                      )}
                    </>
                  ))
                )}
              </TabPanel>
              <TabPanel value="2">Item 2</TabPanel>
              <TabPanel value="3">Item 3</TabPanel>
              <TabPanel value="4">Item 4</TabPanel>
            </TabContext>
          </Box>
        </PostStyle>
      </Stack>
    ),

    [getPostsLoading, value]
  );

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.neutral' }}>
      <Container>
        <RootStyle>
          <Stack spacing={7.5} direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={4} sx={{ width: 264 }}>
              <Menu />
              <GoPremium />
              <Helpers />
            </Stack>
            {renderPostsMemo}
            <Stack spacing={1.5} sx={{ width: 264 }}>
              <MyConnectionsDonors />
              <Tops />
              <Ads />
            </Stack>
          </Stack>
        </RootStyle>
      </Container>
    </Box>
  );
}
