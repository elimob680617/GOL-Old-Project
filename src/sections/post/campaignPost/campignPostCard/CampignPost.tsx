import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { PostActions, PostCard, PostCommets, PostDonationDetails, PostTitle } from 'src/components/Post';
import PostDes from 'src/components/Post/PostDescription';
import { PATH_APP } from 'src/routes/paths';

const ImgStyle = styled('img')(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'block',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  objectFit: 'cover',
}));
interface IPostCardInterface {
  post: any;
  isShared?: boolean;
}
function CampignPost(props: IPostCardInterface) {
  const { post, isShared = false } = props;
  const [isReport, setIsReport] = useState<boolean>(false);
  const [countLike, setCountLike] = useState(post?.countOfLikes);
  const [getCommentValueFlag, setGetCommentValueFlag] = useState<number>(0);

  useEffect(() => {}, [getCommentValueFlag]);
  const { push } = useRouter();

  const [commentOpen, setCommentOpen] = useState<boolean>(true);

  const [isLike, setIsLike] = useState(post?.isLikedByUser);
  useEffect(() => {
    setIsLike(post?.isLikedByUser);
  }, [post?.isLikedByUser]);

  useEffect(() => {
    setCountLike(post?.countOfLikes);
  }, [post?.countOfLikes]);

  return (
    <>
      {isReport && (
        <Stack
          direction={'row'}
          alignItems={'center'}
          sx={{ background: '#fff', p: 2, borderRadius: '10px' }}
          spacing={1}
        >
          <Icon name="Info" />{' '}
          <Typography variant="subtitle2" color="text.secondary">
            This post reported by you
          </Typography>
        </Stack>
      )}
      <PostCard>
        <PostTitle
          avatar={
            <Avatar
              sx={{ height: 48, width: 48, cursor: 'pointer' }}
              aria-label="recipe"
              src={post?.userAvatarUrl}
              variant={post?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
            />
          }
          username={post?.fullName ? post?.fullName : `${post?.firstName} ${post?.lastName}`}
          Date={post?.createdDateTime}
          PostNo={'simple'}
          location={post?.placeDescription}
          isMine={post?.isMine}
          userId={post?.ownerUserId}
          userType={post?.userType}
          postId={post?.id}
        />
        <Box sx={{ paddingTop: 2 }} onClick={() => push(`${PATH_APP.post.postDetails.index}/${post?.id}`)}>
          <ImgStyle src={post?.coverImageUrl} />
        </Box>
        <PostDes description={post?.summary || ''} title={post?.title} id={post?.id} PostNo={true} />
        <PostDonationDetails
          dayleft={post?.dayLeft}
          numberOfDonations={post?.numberOfDonations}
          averageRate={post?.averageRate}
          numberOfRates={post?.numberOfRates}
          raisedMoney={post?.raisedMoney}
          target={post?.target}
        />
        {!isShared && (
          <>
            <Divider />
            <Stack sx={{ p: 2 }}>
              <PostActions
                sendRouteType="home"
                shareRouteType="home"
                sharedSocialPost={post?.sharedSocialPost}
                sharedCampaignPost={post?.sharedCampaignPost}
                postType="campaign"
                inDetails={false}
                like={countLike}
                countLikeChanged={setCountLike}
                comment={post?.countOfComments || '0'}
                share={post?.countOfShared || '0'}
                view={post?.countOfViews || '0'}
                setCommentOpen={setCommentOpen}
                commentOpen={commentOpen}
                id={post?.id}
                isLikedByUser={isLike}
                likeChanged={setIsLike}
              />
            </Stack>
            {!commentOpen ? (
              <PostCommets PostId={post?.id} countOfComments={post?.countOfComments || '0'} postType="campaign" />
            ) : null}
          </>
        )}
      </PostCard>
    </>
  );
}

export default CampignPost;
