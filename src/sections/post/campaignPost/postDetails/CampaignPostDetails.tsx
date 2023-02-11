// @mui
import { Box, Card, CardMedia, Divider, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import { Happyemoji } from 'iconsax-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { FundRaisingPostResDto } from 'src/@types/sections/serverTypes';
import { PostActions, PostCommets } from 'src/components/Post';
import SharePostAddLocationDialog from 'src/sections/post/sharePost/SharePostAddLocationDialog';
import { useLazyGetFundRaisingPostQuery } from 'src/_requests/graphql/post/post-details/queries/getFundRaisingPost.generated';
import SendPostInChatDialog from '../../sharePost/sendPost/SendPostChatDialog';
import SendToConnectionsDialog from '../../sharePost/sendPost/SendToConnectionsDialog';
import SharePostDialog from '../../sharePost/SharePostDialog';
import PostDetailsDonationDetails from './PostDetailsDonationDetails';
import PostDetailsHeader from './PostDetailsHeader';
import PostDetailsNgoInfo from './PostDetailsNgoInfo';

const CardStyle = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
}));

const StarRateWrapper = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.spacing(1),
}));

const CampaignPostDetails: FC = () => {
  const { query } = useRouter();

  const pageSector = useCallback(() => {
    if (query?.id) {
      switch (query?.id[1] as string) {
        case 'share':
          return <SharePostDialog routeType={'postDetails'} />;
        case 'send':
          return <SendPostInChatDialog routeType={'postDetails'} />;
        case 'location':
          return <SharePostAddLocationDialog routeType={'postDetails'} />;
        case 'connections':
          return <SendToConnectionsDialog />;
        default:
          return null;
      }
    }
    return;
  }, [query?.id]);
  const renderSector = useMemo(() => pageSector(), [pageSector]);

  const [value, setValue] = useState<number | null>(0);
  const [commentOpen, setCommentOpen] = useState<boolean>(true);
  const theme = useTheme();
  const [getFundRaisingPost, { data: campaignPostData, isSuccess }] = useLazyGetFundRaisingPostQuery();
  const [campaignPost, setCampaignPost] = useState<FundRaisingPostResDto | undefined | null>(undefined);
  const [isLike, setIsLike] = useState(campaignPost?.isLikedByUser);
  const [countLike, setCountLike] = useState(campaignPost?.countOfLikes);
  const [commentsCount, setCommentsCount] = useState<string | null | undefined>('0');

  useEffect(() => {
    if (query?.id) getFundRaisingPost({ filter: { dto: { id: query.id[0] as string } } });
  }, [getFundRaisingPost, query]);

  useEffect(() => {
    if (isSuccess && campaignPostData) {
      setCampaignPost(campaignPostData?.getFundRaisingPost?.listDto?.items?.[0]);
      setCommentsCount(campaignPostData?.getFundRaisingPost?.listDto?.items?.[0]?.countOfComments);
    }
  }, [campaignPostData, isSuccess]);

  useEffect(() => {
    setIsLike(campaignPost?.isLikedByUser);
  }, [campaignPost?.isLikedByUser]);

  useEffect(() => {
    setCountLike(campaignPost?.countOfLikes);
  }, [campaignPost?.countOfLikes]);
  return (
    <>
      <Head>
        <meta property="og:image" content={campaignPost?.coverImageUrl || '/icons/empty_cover.svg'} key="ogimage" />
        <meta property="og:title" content={campaignPost?.title || 'post title'} key="ogtitle" />
        <meta property="og:description" content={campaignPost?.placeDescription || 'post description'} key="ogdesc" />
        <meta property="twitter:card" content={campaignPost?.title || 'post title'} />
        <meta property="twitter:image" content={campaignPost?.placeDescription || 'post description'} />
      </Head>
      <Grid container spacing={3}>
        <Grid item xl={8} md={7} sm={12} xs={12}>
          <Stack>
            <CardStyle>
              <CardMedia
                component="img"
                alt="Cover Image"
                height={'250px'}
                image={campaignPost?.coverImageUrl || '/icons/empty_cover.svg'}
              />

              <Stack>
                <Stack sx={{ mx: 2, mt: 4 }}>
                  <PostDetailsHeader
                    title={campaignPost?.title || ''}
                    isMine={!!campaignPost?.isMine}
                    id={campaignPost?.id}
                  />
                </Stack>

                <Stack sx={{ mx: 2, mt: 4 }}>
                  <PostDetailsNgoInfo
                    fullName={campaignPost?.fullName as string}
                    avatar={campaignPost?.userAvatarUrl as string}
                    location={campaignPost?.placeDescription as string}
                    createdDateTime={campaignPost?.createdDateTime as string}
                    userType={campaignPost?.userType || undefined}
                    ownerUserId={campaignPost?.ownerUserId as string}
                    isMine={!!campaignPost?.isMine}
                  />
                </Stack>

                <Stack sx={{ mx: 2, mt: 4 }}>
                  <Box>
                    <Typography>{ReactHtmlParser(campaignPost?.body || '')}</Typography>
                  </Box>
                </Stack>

                {value && value > 0 ? (
                  <StarRateWrapper sx={{ mx: 2, mt: 4 }}>
                    <IconButton>
                      <Happyemoji size="20" color={theme.palette.primary.main} />
                    </IconButton>

                    <Typography variant="subtitle2" color={theme.palette.text.primary} sx={{ mb: 1 }}>
                      Thank you for your rating!
                    </Typography>
                    <Typography variant="body2" color={theme.palette.text.secondary} sx={{ mb: 1 }}>
                      Let us know more about your rating with a comment down below
                    </Typography>
                  </StarRateWrapper>
                ) : (
                  <StarRateWrapper sx={{ mx: 2, mt: 4 }}>
                    <Typography variant="subtitle2" color={theme.palette.text.primary} sx={{ mb: 1 }}>
                      How was this campaign?
                    </Typography>
                    <Rating
                      name="simple-controlled"
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                    />
                  </StarRateWrapper>
                )}

                <Stack sx={{ mb: 3, mt: 4 }}>
                  <Divider />
                  <Stack sx={{ p: 2 }}>
                    <PostActions
                      sendRouteType="postDetails"
                      shareRouteType="postDetails"
                      sharedSocialPost={null}
                      sharedCampaignPost={null}
                      inDetails={true}
                      like={countLike || '0'}
                      countLikeChanged={setCountLike}
                      postType="campaign"
                      comment={campaignPost?.countOfComments || '0'}
                      share={campaignPost?.countOfShared || '0'}
                      view={campaignPost?.countOfViews || '0'}
                      id={campaignPost?.id as string}
                      isLikedByUser={isLike || undefined}
                      likeChanged={setIsLike}
                      setCommentOpen={setCommentOpen}
                      commentOpen={commentOpen}
                      commentsCount={commentsCount}
                    />
                  </Stack>
                  <Divider />
                  {!commentOpen ? (
                    <PostCommets
                      PostId={campaignPost?.id as string}
                      countOfComments={campaignPost?.countOfComments || '0'}
                      postType="campaign"
                      commentsCount={commentsCount}
                      setCommentsCount={setCommentsCount}
                    />
                  ) : null}
                </Stack>
              </Stack>
            </CardStyle>
          </Stack>
        </Grid>
        <Grid item xl={4} md={5} sm={12} xs={12}>
          <PostDetailsDonationDetails
            PostId={campaignPost?.id as string}
            dayleft={campaignPost?.dayLeft as number}
            numberOfDonations={campaignPost?.numberOfDonations as string}
            averageRate={campaignPost?.averageRate}
            numberOfRates={campaignPost?.numberOfRates as string}
            raisedMoney={campaignPost?.raisedMoney}
            target={campaignPost?.target}
            donors={campaignPost?.donors as any}
          />
        </Grid>
      </Grid>
      {renderSector}
    </>
  );
};

export default CampaignPostDetails;
