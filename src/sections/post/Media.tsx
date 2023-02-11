import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { IMediaProps, IUploadingInformations } from 'src/components/upload/GolUploader';
import Image from 'next/image';
import { useSelector } from 'src/redux/store';
import { basicCreateSocialPostSelector } from 'src/redux/slices/post/createSocialPost';
export type IMedias = {
  media: IMediaProps[];
  removeMedia?: (uniqueId: string) => void;
  uploadingInformations?: IUploadingInformations;
  hideUploadedMediaRemoveIcon?: boolean;
  erroredFileResend: () => void;
  erroredFileRemove: () => void;
};

interface IProgressProps extends CircularProgressProps {
  label: string;
}

const Progress: FC<IProgressProps> = (props) => (
  <Box
    sx={{
      position: 'relative',
      display: 'inline-flex',
      backgroundColor: 'rgba(255, 255, 255, 0.64)',
      borderRadius: (theme) => theme.spacing(1),
      padding: (theme) => theme.spacing(1),
    }}
  >
    <CircularProgress variant="determinate" {...props} />
    <Box
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="caption" component="div" color="text.secondary">
        {props.label}
      </Typography>
    </Box>
  </Box>
);

const Media: FC<IMedias> = (props) => {
  const {
    media,
    removeMedia,
    uploadingInformations,
    hideUploadedMediaRemoveIcon,
    erroredFileRemove,
    erroredFileResend,
  } = props;
  const [showOthers, setShowOthers] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [removingUiniqueId, setReemovingUiniqueId] = useState<string>('');
  const [uploadedFilesIds, setUploadedFilesIds] = useState<string[]>([]);
  const [uploadingUiniqueId, setUploadingUiniqueId] = useState<string>('');
  const post = useSelector(basicCreateSocialPostSelector);

  const setGridFlex = (index: number) => {
    if (media.length > index + 1) {
      return 6;
    } else {
      if ((index + 1) % 2 !== 0) {
        return 12;
      } else {
        return 6;
      }
    }
  };

  const RemoveImageStyle = styled(Stack)(({ theme }) => ({
    width: 24,
    height: 24,
    backgroundColor: 'rgba(244, 247, 251, 0.64)',
    borderRadius: theme.shape.borderRadius,
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 3,
    cursor: 'pointer',
  }));

  const UploadingFileErrorStyle = styled(Stack)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }));

  const ExtraMediaStyle = styled(Stack)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(244, 247, 251, 0.64)',
    zIndex: 2,
    cursor: 'pointer',
  }));

  useEffect(() => {
    if (media.length <= 4) {
      setShowOthers(false);
    }
  }, [media]);

  useEffect(() => {
    if (!hideUploadedMediaRemoveIcon) return;
    setShowOthers(true);
  }, [hideUploadedMediaRemoveIcon]);

  useEffect(() => {
    if (uploadingInformations && uploadingInformations.uploadProgress === 100) {
      setUploadingUiniqueId(uploadingInformations.uniqueId);
    }
  }, [uploadingInformations]);

  useEffect(() => {
    if (uploadingUiniqueId) {
      setUploadedFilesIds((prev) => [...prev, uploadingInformations?.uniqueId as string]);
    }
  }, [uploadingUiniqueId]);

  useEffect(() => {
    console.log(uploadedFilesIds);
  }, [uploadedFilesIds]);

  return (
    <Grid container spacing={0.5}>
      {media.slice(0, showOthers ? media.length : 4).map((m, index) => {
        if (m.link.indexOf('.gif') == 0) {
          return (
            <Grid key={m.uniqueId} item xs={setGridFlex(index)}>
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  height: index === 0 && index === media.length - 1 ? '300px' : 214,
                  position: 'relative',
                  backgroundImage: `url(${m.previewLink || m.link})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {index === 3 && media.length > 4 && !showOthers ? (
                  <ExtraMediaStyle onClick={() => setShowOthers(true)} alignItems="center" justifyContent="center">
                    <Typography variant="h3" sx={{ fontSize: '32px!important', lineHeight: '40px', color: 'grey.500' }}>
                      +{media.length - 4}
                    </Typography>
                  </ExtraMediaStyle>
                ) : (
                  <>
                    {removeMedia &&
                      (!hideUploadedMediaRemoveIcon ||
                        (hideUploadedMediaRemoveIcon && !m.link && uploadedFilesIds.includes(m.uniqueId))) && (
                        <RemoveImageStyle
                          onClick={() => {
                            setReemovingUiniqueId(m.uniqueId);
                            removeMedia(m.uniqueId);
                            // setShowConfirmDialog(true);
                          }}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src="/icons/close.svg" width={16} height={16} alt="remove-image" />
                        </RemoveImageStyle>
                      )}

                    {m.type === 'video' &&
                      (uploadingInformations?.uniqueId !== m.uniqueId || !uploadingInformations) && (
                        <img src="/icons/play_icon.svg" width={40} height={40} alt="play-icon" />
                      )}
                    {uploadingInformations && uploadingInformations.uniqueId === m.uniqueId && (
                      <Progress
                        value={uploadingInformations.uploadProgress}
                        label={`${uploadingInformations.uploadProgress}%`}
                      />
                    )}
                  </>
                )}
              </Stack>
            </Grid>
          );
        } else {
          return (
            <Grid key={m.uniqueId} item xs={setGridFlex(index)}>
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  height: index === 0 && index === media.length - 1 ? '300px' : 214,
                  position: 'relative',
                  backgroundImage: `url(${m.previewLink || m.link})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {index === 3 && media.length > 4 && !showOthers ? (
                  <ExtraMediaStyle onClick={() => setShowOthers(true)} alignItems="center" justifyContent="center">
                    <Typography variant="h3" sx={{ fontSize: '32px!important', lineHeight: '40px', color: 'grey.500' }}>
                      +{media.length - 4}
                    </Typography>
                  </ExtraMediaStyle>
                ) : (
                  <>
                    {removeMedia &&
                      post.fileWithError !== m.uniqueId &&
                      (!hideUploadedMediaRemoveIcon ||
                        (hideUploadedMediaRemoveIcon && !m.link && !uploadedFilesIds.includes(m.uniqueId))) && (
                        <RemoveImageStyle
                          onClick={() => {
                            setReemovingUiniqueId(m.uniqueId);
                            removeMedia(m.uniqueId);
                            // setShowConfirmDialog(true);
                          }}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src="/icons/close.svg" width={16} height={16} alt="remove-image" />
                        </RemoveImageStyle>
                      )}

                    {m.type === 'video' &&
                      (uploadingInformations?.uniqueId !== m.uniqueId || !uploadingInformations) && (
                        <img src="/icons/play_icon.svg" width={40} height={40} alt="play-icon" />
                      )}
                    {uploadingInformations && uploadingInformations.uniqueId === m.uniqueId && (
                      <Progress
                        value={uploadingInformations.uploadProgress}
                        label={`${uploadingInformations.uploadProgress}%`}
                      />
                    )}
                  </>
                )}
                {post.fileWithError === m.uniqueId && (
                  <UploadingFileErrorStyle
                    flexWrap="wrap"
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="body1" sx={{ color: 'error.main' }}>
                      Uploading Failed
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton onClick={() => erroredFileRemove()}>
                        <Image
                          width={24}
                          height={24}
                          src="/icons/recycle-bin/Outline.svg"
                          alt="remove erroring image"
                        />
                      </IconButton>
                      <IconButton onClick={() => erroredFileResend()}>
                        <Image width={24} height={24} src="/icons/reload/primary.svg" alt="resend erroring image" />
                      </IconButton>
                    </Stack>
                  </UploadingFileErrorStyle>
                )}
              </Stack>
            </Grid>
          );
        }
      })}
    </Grid>
  );
};

export default Media;
