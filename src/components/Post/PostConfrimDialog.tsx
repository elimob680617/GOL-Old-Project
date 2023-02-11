import { useState } from 'react';
import Image from 'next/image';
import { CloseCircle } from 'iconsax-react';
import { Dialog, Stack, Box, Typography, IconButton, Divider, Button, CircularProgress } from '@mui/material';
import { ERROR } from 'src/theme/palette';
import { useDeleteCommentMutation } from 'src/_requests/graphql/postbehavior/mutations/deleteCommen.generated';
import { styled } from '@mui/material/styles';
import { dispatch } from 'src/redux/store';
import { updateCampaignPostComment, updateSocialPostComment } from 'src/redux/slices/homePage';

const IconButtonAction = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.main,
}));

function PostConfrimDialog(props: any) {
  const {
    setOpenPublishDialog,
    openPublishDialog,
    CommentId,
    setGetNewComments,
    commentsCount,
    setCommentsCount,
    postType,
    postId,
  } = props;
  const [delLoading, setDelLoading] = useState<boolean>(false);
  const [deleteComment] = useDeleteCommentMutation();
  const handleDeleteComent = () => {
    setDelLoading(true);
    deleteComment({ comment: { dto: { id: CommentId } } })
      .unwrap()
      .then((res) => {
        commentsCount ? setCommentsCount(commentsCount - 1) : null;
        postType === 'campaign'
          ? dispatch(updateCampaignPostComment({ id: postId, type: 'negative' }))
          : postType === 'social'
          ? dispatch(updateSocialPostComment({ id: postId, type: 'negative' }))
          : null;
        setOpenPublishDialog(false);
        setGetNewComments(Math.random());
        setDelLoading(false);
      });
  };
  return (
    <Dialog maxWidth="sm" fullWidth onClose={() => setOpenPublishDialog(false)} open={openPublishDialog}>
      <Stack spacing={2} sx={{ py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Are you sure to delete this Comment?
            </Typography>
          </Box>

          <IconButton onClick={() => setOpenPublishDialog(false)}>
            <CloseCircle />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={1} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}>
            <Image src="/icons/commentsIcon/trash/trash.svg" width={24} height={24} alt="send" />
            {delLoading ? (
              <IconButtonAction>
                <CircularProgress size={16} />
              </IconButtonAction>
            ) : (
              <Button onClick={handleDeleteComent}>
                <Typography variant="body2" color={ERROR.main}>
                  Delete comment
                </Typography>
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}>
            <Image src="/icons/commentsIcon/close/Close.svg" width={24} height={24} alt="Cancel" />
            <Button onClick={() => setOpenPublishDialog(false)}>
              <Typography variant="body2" color="text.primary">
                Discard
              </Typography>
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default PostConfrimDialog;
