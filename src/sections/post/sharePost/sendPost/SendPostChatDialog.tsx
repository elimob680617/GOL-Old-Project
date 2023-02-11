// @mui
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { MentionAndHashtag } from 'src/components/textEditor';
import useAuth from 'src/hooks/useAuth';
import { basicSendPostSelector, initialState, resetSendPost, setSendPostText } from 'src/redux/slices/post/sendPost';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { ERROR, SURFACE } from 'src/theme/palette';
import { useLazyGetSocialPostQuery } from 'src/_requests/graphql/post/getSocialPost.generated';
import { useLazyGetFundRaisingPostQuery } from 'src/_requests/graphql/post/post-details/queries/getFundRaisingPost.generated';
import SendCampaignPostCard from './SendCampaignPostCard';
import SendSocialPostCard from './SendSocialPostCard';
//icon
import { Icon } from 'src/components/Icon';

const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));
interface IPostRoute {
  routeType?: 'home' | 'postDetails';
}

function SendPostInChatDialog(props: IPostRoute) {
  const { routeType = 'home' } = props;
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [listOfRichs, setListOfRichs] = useState<any[]>([]);
  const [textLimitation, setTextLimitation] = useState<string>('');
  const [getSocialPost, { data: socialPostData, isFetching: getSocialPostFetching }] = useLazyGetSocialPostQuery();
  const socialPost = socialPostData?.getSocialPost?.listDto?.items?.[0];
  const [getFundRaisingPost, { data: campaignPostData, isFetching: getFundRaisingPostFetching }] =
    useLazyGetFundRaisingPostQuery();
  const campaignPost = campaignPostData?.getFundRaisingPost?.listDto?.items?.[0];
  const postSent = useSelector(basicSendPostSelector);

  const listOfTag: any[] = [];
  const listOfMention: any[] = [];
  let postText = '';
  listOfRichs.map((item) => {
    item?.children?.map((obj: any) => {
      if (obj.type) {
        obj.type === 'tag' ? listOfTag.push(obj?.id) : obj.type === 'mention' ? listOfMention.push(obj?.id) : null;
      }
      obj.text
        ? (postText += obj.text)
        : obj.type === 'tag'
        ? (postText += `#${obj.title}`)
        : obj.type === 'mention'
        ? (postText += `╣${obj.fullname}╠`)
        : (postText += ' ');
    });
    if (listOfRichs.length > 1) {
      postText += '\\n';
    }
  });

  useLayoutEffect(() => {
    if (!postSent?.id) {
      router.back();
    }
  }, []);

  useEffect(() => {
    if (postSent?.id) {
      if (postSent?.postType === 'campaign') {
        getFundRaisingPost({
          filter: {
            dto: { id: postSent?.id },
          },
        });
      } else {
        getSocialPost({ filter: { dto: { id: postSent?.id } } });
      }
    }
  }, [getFundRaisingPost, getSocialPost, postSent?.id, postSent?.postType]);

  return (
    <>
      <Dialog
        fullWidth={true}
        keepMounted
        open={true}
        onClose={() => {
          // router.push(PATH_APP.home.index);
          dispatch(setSendPostText(initialState?.text));
          dispatch(resetSendPost());
          router.back();
        }}
      >
        <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
          <HeaderWrapperStyle direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" color={SURFACE.onSurface}>
              Write a message
            </Typography>
            <IconButton
              onClick={() => {
                // router.push(PATH_APP.home.index);
                dispatch(resetSendPost());
                router.back();
              }}
              sx={{ padding: 0 }}
            >
              <Icon name="Close" type="linear" color="grey.500" />
            </IconButton>
          </HeaderWrapperStyle>
        </DialogTitle>
        <DialogContent sx={{}}>
          <Stack sx={{ my: 3, p: 2, backgroundColor: theme.palette.background.neutral, borderRadius: 1 }}>
            <Stack direction={'row'} spacing={2} alignItems="center">
              <Box>
                <Avatar src={user?.avatarUrl || ''} sx={{ width: 48, height: 48 }} />
              </Box>

              <Box sx={{ width: '100%' }}>
                <MentionAndHashtag
                  setListOfRichs={setListOfRichs}
                  eventType={'sendPost'}
                  setTextLimitation={setTextLimitation}
                  placeholder="Write A Message"
                  value={postSent.text}
                  onChange={(value) => dispatch(setSendPostText(value))}
                />
              </Box>
            </Stack>

            <Stack sx={{ mt: 2 }}>
              {postSent?.postType === 'campaign' ? (
                getFundRaisingPostFetching ? (
                  <CircularProgress size={16} />
                ) : (
                  <SendCampaignPostCard sentPost={campaignPost} />
                )
              ) : getSocialPostFetching ? (
                <CircularProgress size={16} />
              ) : (
                <SendSocialPostCard sentPost={socialPost} />
              )}
            </Stack>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: 'flex-end' }}>
          {Number(textLimitation) >= 1001 ? (
            <Stack spacing={2} width="100%">
              <Stack alignItems={'center'} direction="row" justifyContent={'start'}>
                <Icon name="Exclamation-Mark" color="error.main" type="solid" />
                <Typography variant="button" color={ERROR.main}>
                  Characters should be less than 1,000.
                </Typography>
              </Stack>
            </Stack>
          ) : routeType === 'home' ? (
            <Link href={PATH_APP.post.sendPost.sendToConnections} shallow passHref>
              <Button variant="contained" sx={{ width: 120 }}>
                Next
              </Button>
            </Link>
          ) : (
            <Link
              href={`${PATH_APP.post.postDetails.index}/${postSent?.id}/connections/${postSent?.postType}`}
              shallow
              passHref
            >
              <Button variant="contained" sx={{ width: 120 }} disabled={Number(textLimitation) >= 1001}>
                Next
              </Button>
            </Link>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SendPostInChatDialog;
