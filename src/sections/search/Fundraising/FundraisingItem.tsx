import { Avatar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import { PostActions, PostCard, PostCommets, PostDonationDetails, PostTitle } from 'src/components/Post';
import PostDes from 'src/components/Post/PostDescription';

const ImgStyle = styled('img')(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'block',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  objectFit: 'cover',
}));

function CampignPost(props) {
  const { post } = props;

  const { push } = useRouter();

  const [commentOpen, setCommentOpen] = useState<boolean>(true);
  const [countLike, setCountLike] = useState(post?.countOfLikes);
  const [isLike, setIsLike] = useState(post?.isLikedByUser);
  const [commentsCount, setCommentsCount] = useState<string | null | undefined>('0');
  useEffect(() => {
    setCommentsCount(post?.countOfComments);
  }, [post]);

  useEffect(() => {
    setIsLike(post?.isLikedByUser);
  }, [post?.isLikedByUser]);

  useEffect(() => {
    setCountLike(post?.countOfLikes);
  }, [post?.countOfLikes]);

  return (
    <Box
      sx={{
        border: (theme) => `1px solid ${theme.palette.grey[100]}`,
        borderRadius: '8px',
        ':hover': {
          border: (theme) => `1px solid ${theme.palette.grey[300]}`,
        },
      }}
    >
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
          username={post?.fullName}
          Date={post?.createdDateTime}
          PostNo={'simple'}
          location={post?.placeDescription}
          isMine={post?.isMine}
          userId={post?.ownerUserId}
          userType={post?.userType}
          postId={post?.id}
        />
        <Box sx={{ paddingTop: 2 }} onClick={() => push(`/post/post-details/${post?.id}`)}>
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
        <Box sx={{ m: 2, mt: 0 }}>
          <PostActions
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
            commentsCount={commentsCount}
          />
        </Box>
        {!commentOpen ? (
          <PostCommets
            commentsCount={commentsCount}
            setCommentsCount={setCommentsCount}
            PostId={post?.id}
            countOfComments={post?.countOfComments || '0'}
            postType="campaign"
          />
        ) : null}
      </PostCard>
    </Box>
  );
}

export default CampignPost;
