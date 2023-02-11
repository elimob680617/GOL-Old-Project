import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ExclamationMark from 'public/icons/Exclamation Mark/24/Outline.svg';
import { FC, useEffect, useState } from 'react';
import { IMediaProps, LimitationType } from 'src/components/upload/GolUploader';
import { basicCreateSocialPostSelector } from 'src/redux/slices/post/createSocialPost';
import { getUploadingFiles } from 'src/redux/slices/upload';
import { useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { ERROR } from 'src/theme/palette';

const PostButtonStyle = styled(LoadingButton)(() => ({
  width: 120,
}));

const WrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  // height: 64,
  borderTop: `1px solid ${theme.palette.grey[100]}`,
  width: '100%',
}));

const OkStyle = styled(Button)(({ theme }) => ({
  color: theme.palette.grey[800],
  border: `1px solid #C8D3D9`,
  width: 120,
}));

const Input = styled('input')({
  display: 'none',
});

interface ICreatePostMainFotterProps {
  addImage: () => void;
  startPosting: () => void;
  loading: boolean;
  limitationError: LimitationType;
  okLimitationClicked: () => void;
  media: IMediaProps[];
  textLimitation: any;
  disableButtons: boolean;
}

const CreatePostMainFotter: FC<ICreatePostMainFotterProps> = (props) => {
  const {
    addImage,
    startPosting,
    loading,
    limitationError,
    okLimitationClicked,
    media,
    textLimitation,
    disableButtons,
  } = props;
  const post = useSelector(basicCreateSocialPostSelector);
  const uploadingFiles = useSelector(getUploadingFiles);
  const [hasGIF, setHasGIF] = useState<number>(0);
  const [hasText, setHasText] = useState<boolean>(false);

  useEffect(() => {
    if (media?.length === 0) {
      setHasGIF(0);
    } else if (media[0]?.type === 'gif') {
      setHasGIF(1);
    } else {
      setHasGIF(2);
    }
  }, [media]);
  useEffect(() => {
    if (
      post.text.length === 1 &&
      (post.text[0] as any).children.length === 1 &&
      (post.text[0] as any).children[0].text === ''
    ) {
      setHasText(false);
    } else {
      setHasText(true);
    }
  }, [post.text]);

  return (
    <WrapperStyle
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      sx={[(theme) => ({})]}
    >
      {textLimitation >= 3001 ? (
        <Box sx={{ width: '100%', height: 'rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Image src={ExclamationMark} alt="" />
          <Typography variant="button" color={ERROR.main}>
            Characters should be less than 3,000.
          </Typography>
        </Box>
      ) : null}
      {!limitationError && (
        <Stack direction="row" spacing={3} alignItems="center">
          <IconButton
            style={{ display: hasGIF === 1 ? 'none' : '' }}
            onClick={() => {
              if (!disableButtons) addImage();
            }}
            aria-label="upload picture"
            component="span"
          >
            <img src="/icons/media/gallery.svg" width={24} height={24} alt="import-image" />
          </IconButton>
          {!disableButtons && (
            <Stack direction="row" spacing={3} alignItems="center">
              <Link href={PATH_APP.post.createPost.socialPost.addGif} shallow passHref>
                <IconButton style={{ display: hasGIF === 2 ? 'none' : '' }}>
                  <img src="/icons/gif.svg" width={24} height={24} alt="post-gifs" />
                </IconButton>
              </Link>
              <Link href={PATH_APP.post.createPost.socialPost.addLocation} shallow passHref>
                <IconButton>
                  <img src="/icons/location/location.svg" width={24} height={24} alt="post-gifs" />
                </IconButton>
              </Link>
            </Stack>
          )}
          {disableButtons && (
            <Stack direction="row" spacing={3} alignItems="center">
              <IconButton style={{ display: hasGIF === 2 ? 'none' : '' }}>
                <img src="/icons/gif.svg" width={24} height={24} alt="post-gifs" />
              </IconButton>

              <IconButton>
                <img src="/icons/location/location.svg" width={24} height={24} alt="post-gifs" />
              </IconButton>
            </Stack>
          )}
        </Stack>
      )}

      {/* FIXME add primary variant to button */}
      {/* FIXME fix button styles for overrides */}

      {!limitationError && (
        <PostButtonStyle
          loading={loading}
          disabled={
            (!post.editMode &&
              !hasText &&
              hasGIF !== 1 &&
              // post.picturesUrls.length === 0 &&
              // post.videoUrls.length === 0 &&
              post.mediaUrls.length === 0 &&
              !post.location &&
              uploadingFiles.length === 0) ||
            (post.editMode &&
              !hasText &&
              hasGIF !== 1 &&
              // post.picturesUrls.length === 0 &&
              // post.videoUrls.length === 0 &&
              post.mediaUrls.length === 0 &&
              !post?.location?.id &&
              uploadingFiles.length === 0 &&
              media.length === 0)
          }
          onClick={() => {
            startPosting();
          }}
          variant="primary"
        >
          {post.editMode ? 'Edit' : 'Post'}
        </PostButtonStyle>
      )}

      {limitationError && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Stack spacing={1} direction="row" alignItems="center">
            <img src="/icons/warning/Outline.svg" width={24} height={24} alt="limitation-warning" />
            <Typography
              variant="body2"
              sx={{ color: 'error.main', fontWeight: '300', fontSize: '14px', lineHeight: '17.5px' }}
            >
              {limitationError === 'videoSize'
                ? 'The video file that you have selected is larger than 2 GB. Unable to send file.'
                : limitationError === 'imageSize'
                ? 'The Image file that you have selected is larger than 30 MB. Unable to send file.'
                : limitationError === 'imageCount' || limitationError === 'videoCount'
                ? 'Please reduce the number of media files you are attaching. You can add maximum 10 images and 5 videos'
                : ''}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <OkStyle
              onClick={() => okLimitationClicked()}
              variant="primary"
              sx={{ color: 'grey.800', border: '1px solid' }}
            >
              OK
            </OkStyle>
          </Stack>
        </Stack>
      )}
    </WrapperStyle>
  );
};

export default CreatePostMainFotter;
