import { Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { PostStatus } from 'src/@types/sections/serverTypes';
import Avatar from 'src/components/Avatar';
import CustomLink from 'src/components/CustomLink';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { useLazyGetFundRaisingPostsQuery } from 'src/_requests/graphql/post/campaign-post/queries/getCampaignPosts.generated';
import CampaignPostListDialog, { IPost } from '../careateCampaignPost/CampaignPostListDialog';
import CampaginItemsWrapper from './CampaginItemsWrapper';
import CampaginItem from './CampaingItem';

const Drafts = () => {
  const [getDrafts, { isLoading: draftsLoading, data: draftResponse }] = useLazyGetFundRaisingPostsQuery();
  const [getDraftsForAll, { isLoading: draftsForAllLoading, data: draftsForAllResponse }] =
    useLazyGetFundRaisingPostsQuery();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [allDrafts, setAllDrafts] = useState<IPost[]>([]);

  useEffect(() => {
    if (user)
      getDrafts({ filter: { dto: { status: PostStatus.Draft, ownerUserId: user?.id }, pageIndex: 0, pageSize: 3 } });
    getDraftsForAll({ filter: { dto: { status: PostStatus.Draft, ownerUserId: user?.id } } });
  }, [user]);

  useEffect(() => {
    if (draftsForAllResponse?.getHomePageFundRaisingPosts.listDto?.items) {
      setAllDrafts(
        draftsForAllResponse?.getHomePageFundRaisingPosts.listDto?.items.map((value) => ({
          coverImageUrl: value?.coverImageUrl || '',
          createdDateTime: value?.createdDateTime || '',
          id: value?.id || '',
          ownerUserId: value?.ownerUserId || '',
          status: value?.status || PostStatus.Draft,
          title: value?.title || '',
        }))
      );
    }
  }, [draftsForAllResponse]);

  return (
    <CampaginItemsWrapper title="Draft" linkCallBack={() => setOpenDialog(true)}>
      {!draftsLoading &&
        draftResponse?.getHomePageFundRaisingPosts.listDto?.items?.map((post) => (
          <CustomLink key={post?.id} path={`${PATH_APP.post.createPost.campainPost.draft}/${post?.id}`}>
            <CampaginItem
              avatar={
                <Avatar src={post?.coverImageUrl || ''} sx={{ borderRadius: 1, width: 48, height: 48 }}>
                  {post?.title ? post.title[0] : ''}
                </Avatar>
              }
              date={
                <Typography variant="caption" color="text.secondary" noWrap>
                  {post?.createdDateTime}
                </Typography>
              }
              title={
                <Typography variant="subtitle2" color="text.primary" noWrap>
                  {post?.title || 'No title'}
                </Typography>
              }
            />
          </CustomLink>
        ))}
      {draftsLoading && (
        <>
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={60} />
        </>
      )}
      <CampaignPostListDialog
        loading={draftsForAllLoading}
        onClose={() => setOpenDialog(false)}
        open={openDialog}
        posts={allDrafts}
        removedPost={(id) => setAllDrafts([...allDrafts.filter((i) => i.id !== id)])}
        variant="draft"
      />
    </CampaginItemsWrapper>
  );
};

export default Drafts;
