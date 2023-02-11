import { Box, styled, SxProps, Theme } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import Resumable from 'resumablejs';
import { EntityType } from 'src/@types/sections/serverTypes';
import { FILELIMITATION } from 'src/config';
import { basicCreateSocialPostSelector, setFileWithErrorId } from 'src/redux/slices/post/createSocialPost';
import { getUploadingFiles, setUploadingFiles } from 'src/redux/slices/upload';
import { useDispatch, useSelector } from 'src/redux/store';
import { getFileInputInformations } from 'src/utils/fileFunctions';
import { v4 as uuidv4 } from 'uuid';
import BlockContent from './BlockContent';

type GolUploaderVariant = 'witUi' | 'withOutUi';

interface IGolUploaderInterface {
  audioEntityType?: EntityType;
  videoEntityType?: EntityType;
  imageEntityType?: EntityType;
  documentEntityType?: EntityType;
  uploadedLinkAdded: (linkProp: IMediaProps[]) => void;
  previewLinksAdded: (linkProps: IMediaProps[]) => void;
  linkRemoved: (linkProp: IMediaProps) => void;
  sx?: SxProps<Theme>;
  accept?: Accept;
  removingUniqueId?: string | null;
  uploadStart: boolean;
  variant: GolUploaderVariant;
  showInput?: boolean;
  uploadeError?: (error: LimitationType) => void;
  chunkFileUploadingChanges: (chunkUpload: IChunkUploadFile) => void;
  cancelAllUpload?: boolean;
  resendFileFlag: number;
}

type fileType = 'image' | 'video';

interface IValue {
  file: File;
  thumbnail: string;
}

export interface IUploadingFiles {
  type: fileType;
  value: IValue;
  uniqueId: string;
}

export type mediaType = 'image' | 'video' | 'gif';

export interface IMediaProps {
  link: string;
  uniqueId: string;
  type: mediaType;
  previewLink: string;
}

type StatusType =
  | 'complete'
  | 'fileSuccess'
  | 'fileError'
  | 'fileProgress'
  | 'cancel'
  | 'uploadStart'
  | 'pause'
  | 'fileError'
  | 'notStarted';

export interface IChunkUploadFile {
  status: StatusType;
  progress: number;
  uniqueId: string;
}

export type LimitationType = 'videoSize' | 'imageSize' | 'imageCount' | 'videoCount' | '';

export interface IUploadingInformations {
  uniqueId: string;
  uploadProgress: number;
}

interface IDropzoneStyleProps {
  variant: GolUploaderVariant;
}

const DropZoneStyle = styled('div')<IDropzoneStyleProps>(({ theme, variant }) => ({
  outline: 'none',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: variant === 'witUi' ? theme.palette.background.neutral : '',
  border: variant === 'witUi' ? `1px dashed ${theme.palette.grey[500_32]}` : '',
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
  display: variant === 'witUi' ? '' : 'none',
}));

const GolUploader: FC<IGolUploaderInterface> = (props) => {
  const uploadingFiles = useSelector(getUploadingFiles);
  const uploadingFilesRef = useRef(uploadingFiles);
  const dispatch = useDispatch();
  const [firstTime, setFirstTime] = useState<boolean>(true);
  const post = useSelector(basicCreateSocialPostSelector);

  useEffect(() => {
    if (firstTime) {
      addToLinks(uploadingFiles);
      setFirstTime(false);
    }
  }, [uploadingFiles]);

  const uploadServiceUrl = process.env.NEXT_UPLOAD_URL as string;

  const config: Resumable.ConfigurationHash = {
    generateUniqueIdentifier() {
      return uuidv4();
    },
    testChunks: false,
    chunkSize: 1 * 1024 * 1024,
    simultaneousUploads: 1,
    fileParameterName: 'file',
    forceChunkSize: true,
    uploadMethod: 'PUT',
    chunkNumberParameterName: 'chunkNumber',
    chunkSizeParameterName: 'chunkSize',
    currentChunkSizeParameterName: 'chunkSize',
    fileNameParameterName: 'fileName',
    totalSizeParameterName: 'totalSize',
  };

  // const [uploadImage] = useUploadImageMutation();

  const [resumable, setResumable] = useState<Resumable>(new Resumable(config));
  const [chunkFileUploading, setChunkFileUploading] = useState<IChunkUploadFile>({
    progress: 0,
    status: 'notStarted',
    uniqueId: '',
  });
  const [uploadingFileIndex, setUploadingFileIndex] = useState<number | null>(null);
  const uploadingFileIndexRef = useRef(uploadingFileIndex);

  const upload = (file: File) => {
    // const creationSessionId = uuidv4();

    resumable.addFile(file);
    const creationSessionId = Number.parseInt(`${Math.random() * 1000}`);
    fetch(`${uploadServiceUrl}api/fileupload/create/${creationSessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chunkSize: resumable!.opts.chunkSize,
        totalSize: file.size,
        fileName: file.name,
      }),
    })
      .then((response) => response.json())
      .then((data: any) => {
        resumable.opts.target = `${uploadServiceUrl}api/fileupload/upload/user/${creationSessionId}/session/${data.sessionId}`;
        resumable.upload();
      });
  };

  const {
    imageEntityType,
    previewLinksAdded,
    sx,
    accept,
    removingUniqueId,
    uploadedLinkAdded,
    uploadStart,
    variant,
    showInput,
    linkRemoved,
    uploadeError,
    chunkFileUploadingChanges,
    cancelAllUpload,
    resendFileFlag,
  } = props;

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, open } = useDropzone({
    accept,
  });

  useEffect(() => {
    if (showInput) {
      open();
    }
  }, [showInput]);

  useEffect(() => {
    if (cancelAllUpload) {
      if (resumable) {
        resumable.cancel();
      }
    }
  }, [cancelAllUpload]);

  const [links, setLinks] = useState<IMediaProps[]>([]);
  const errorSetted = useRef<boolean>(false);
  const linksRef = useRef(links);

  const videoRef = useRef<any>(null);

  useEffect(() => {
    valuingUploadingFileWhenAcceptedFilesChange();
  }, [acceptedFiles]);

  const valuingUploadingFiles = (files: IUploadingFiles[]) => {
    dispatch(setUploadingFiles(files));
    uploadingFilesRef.current = files;
  };

  const valuingLinks = (links: IMediaProps[]) => {
    setLinks([...links]);
    linksRef.current = links;
  };

  const cancelUploadingFile = (removingUniqueId: string) => {
    if (chunkFileUploading.uniqueId === removingUniqueId) {
      resumable.cancel();
    }
  };

  const valuingNextFileWhenCancelOrResend = () => {
    setUploadingFileIndex(null);
    setTimeout(() => {
      setChunkFileUploading((prev) => ({ uniqueId: '', status: 'fileError', progress: 0 }));
      uploadingFileIndexRef.current = uploadingFileIndexRef.current! - 1;
      getNextFile();
    }, 10);
  };

  useEffect(() => {
    if (removingUniqueId) {
      const removingIndex = uploadingFiles.findIndex((i) => i.uniqueId === removingUniqueId);
      if (removingIndex >= 0) {
        const lastUploadingFiles = [...uploadingFiles];
        const lastLinks = [...links];
        const removedLink = lastLinks[removingIndex];
        lastUploadingFiles.splice(removingIndex, 1);
        lastLinks.splice(removingIndex, 1);
        valuingUploadingFiles(lastUploadingFiles);
        valuingLinks(lastLinks);
        linkRemoved(removedLink);
        cancelUploadingFile(removingUniqueId);
      }
      if (removingUniqueId === post.fileWithError) {
        setTimeout(() => {
          valuingNextFileWhenCancelOrResend();
        }, 10);
      }
    }
  }, [removingUniqueId]);

  useEffect(() => {
    if (resendFileFlag) {
      dispatch(setFileWithErrorId(''));
      valuingNextFileWhenCancelOrResend();
    }
  }, [resendFileFlag]);

  useEffect(() => {
    setResumable(new Resumable(config));
  }, []);

  const getNextFile = () => {
    if (uploadingFilesRef.current[uploadingFileIndexRef.current! + 1]) {
      const nextUniqueId = uploadingFilesRef.current[uploadingFileIndexRef.current! + 1].uniqueId;
      setChunkFileUploading((prev) => ({
        progress: 0,
        status: 'fileSuccess',
        uniqueId: nextUniqueId,
      }));
    }

    valuingUploadingFileIndex(uploadingFileIndexRef.current! + 1);
    // else {
    //   setChunkFileUploading((prev) => ({
    //     progress: 0,
    //     status: 'fileSuccess',
    //     uniqueId: '',
    //   }));
    //   console.log(post);
    //   uploadedLinkAdded(linksRef.current);
    // }
  };

  useEffect(() => {
    if (resumable) {
      resumable.on('fileSuccess', (file: Resumable.ResumableFile, message: string) => {
        const newUploadingFileIndex = uploadingFileIndexRef.current;
        if (newUploadingFileIndex !== null && newUploadingFileIndex >= 0) {
          const newUploadingFileTumbnail = uploadingFilesRef.current[newUploadingFileIndex].value.thumbnail;
          const uniqueId = uploadingFilesRef.current[newUploadingFileIndex].uniqueId;
          const type = uploadingFilesRef.current[newUploadingFileIndex].type;
          const newLinks = linksRef.current;
          newLinks[newUploadingFileIndex] = {
            link: message.replace(/["']/g, ''),
            previewLink: newUploadingFileTumbnail,
            type,
            uniqueId,
          };
          valuingLinks(newLinks);
        }
        getNextFile();
      });

      resumable.on('fileError', (file, message) => {
        setChunkFileUploading((prev) => ({ uniqueId: '', status: 'fileError', progress: 0 }));
        // getNextFile();
        dispatch(setFileWithErrorId(uploadingFilesRef.current[uploadingFileIndexRef.current!].uniqueId));
      });

      resumable.on('cancel', (file, message) => {
        if (
          uploadingFilesRef.current[uploadingFileIndexRef.current!] &&
          uploadingFilesRef.current[uploadingFileIndexRef.current!].uniqueId === post.fileWithError
        )
          return;
        valuingNextFileWhenCancelOrResend();
      });

      resumable.on('fileProgress', (file: any, message: string) => {
        const newUploadingFileIndex = uploadingFileIndexRef.current!;
        const uploadingFile = uploadingFilesRef.current[newUploadingFileIndex];
        if (!uploadingFile) {
          return;
        }
        const uniqueId = uploadingFilesRef.current[newUploadingFileIndex].uniqueId;
        setChunkFileUploading((prev) => ({
          status: 'fileProgress',
          progress: file.progress() * 100,
          uniqueId: uniqueId,
        }));
      });
    }
  }, [resumable]);

  useEffect(() => {
    chunkFileUploadingChanges(chunkFileUploading);
  }, [chunkFileUploading]);

  const uploadAllFiles = () => {
    const newLinks = [...links];
    if (newLinks.length > 0) {
      // upload(uploadingFiles[uploadingFileIndexRef.current].value.file);
      valuingUploadingFileIndex(0);
    } else {
      uploadedLinkAdded(newLinks);
    }
  };

  useEffect(() => {
    if (!uploadStart) {
      valuingUploadingFileIndex(null);
      return;
    }
    // uploadAllImages().then().catch();
    valuingUploadingFileIndex(0);
    uploadAllFiles();
  }, [uploadStart]);

  const valuingUploadingFileIndex = (index: number | null) => {
    setUploadingFileIndex(index);
    uploadingFileIndexRef.current = index;
  };

  useEffect(() => {
    if (uploadingFileIndex !== null) {
      if (!uploadingFiles[uploadingFileIndex]) {
        uploadedLinkAdded(linksRef.current);
      } else {
        setTimeout(() => {
          const fileValue = uploadingFiles[uploadingFileIndex].value;
          upload(fileValue.file);
        }, 10);
      }
    }
  }, [uploadingFileIndex]);

  const addToLinks = (newUploadingFiles: IUploadingFiles[]) => {
    const newLinks: IMediaProps[] = [];
    newUploadingFiles.forEach((file) => {
      if (file.type === 'image') {
        const value = file.value;
        newLinks.push({ link: '', previewLink: value.thumbnail, uniqueId: file.uniqueId, type: 'image' });
      } else {
        const value = file.value;
        newLinks.push({ link: '', uniqueId: file.uniqueId, type: 'video', previewLink: value.thumbnail! });
      }
      valuingLinks([...links, ...newLinks]);
      previewLinksAdded(newLinks);
    });
  };

  const generateThumbnailAsync = () =>
    new Promise<string>((resolve) => {
      const handleSeeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef!.current!.videoWidth;
        canvas.height = videoRef!.current!.videoHeight;
        canvas!.getContext('2d')!.drawImage(videoRef.current!, 0, 0);
        // convert it to a usable data URL
        const dataURL = canvas.toDataURL();
        videoRef!.current!.removeEventListener('seeked', handleSeeked);
        resolve(dataURL);
      };
      videoRef!.current!.addEventListener('seeked', handleSeeked);
      videoRef!.current!.currentTime = 1;
    });

  const sendError = (error: LimitationType) => {
    if (!errorSetted.current && uploadeError) {
      errorSetted.current = true;
      uploadeError(error);
    }
  };

  const handleFiles = (file: File) => {
    if (new RegExp('image', 'g').test(file.type)) {
      if (file.size > FILELIMITATION.image) {
        sendError('imageSize');
        return false;
      }
      return true;
    } else if (new RegExp('video', 'g').test(file.type)) {
      if (file.size > FILELIMITATION.video) {
        sendError('videoSize');
        return false;
      }
      return true;
    } else {
      return false;
    }
  };

  const valuingUploadingFileWhenAcceptedFilesChange = async () => {
    try {
      errorSetted.current = false;
      if (acceptedFiles.length === 0) return;
      let filesIndex = 0;
      let newAdded: IUploadingFiles[] = [];
      while (filesIndex !== acceptedFiles.length) {
        const fileStatus = handleFiles(acceptedFiles[filesIndex]);
        if (new RegExp('image', 'g').test(acceptedFiles[filesIndex].type) && fileStatus) {
          const fileInput = await getFileInputInformations(acceptedFiles[filesIndex], imageEntityType!);
          // await new Promise((resolve) => setTimeout(resolve, 1000));
          const returned: IUploadingFiles = {
            type: 'image',
            value: { file: acceptedFiles[filesIndex], thumbnail: fileInput.binary! },
            uniqueId: uuidv4(),
          };
          newAdded.push(returned);
        } else if (new RegExp('video', 'g').test(acceptedFiles[filesIndex].type) && fileStatus) {
          if (acceptedFiles[filesIndex].type !== 'video/x-ms-wmv' && acceptedFiles[filesIndex].type !== 'video/avi') {
            videoRef!.current!.src = URL.createObjectURL(acceptedFiles[filesIndex]);
            const thumbnail = await generateThumbnailAsync();
            const returned: IUploadingFiles = {
              type: 'video',
              value: { file: acceptedFiles[filesIndex], thumbnail },
              uniqueId: uuidv4(),
            };
            newAdded.push(returned);
          } else {
            const returned: IUploadingFiles = {
              type: 'video',
              value: { file: acceptedFiles[filesIndex], thumbnail: '' },
              uniqueId: uuidv4(),
            };
            newAdded.push(returned);
          }
        }
        filesIndex += 1;
      }

      newAdded = newAdded.filter((i) => i != undefined && i != null);
      const newUploadingFiles = [...uploadingFiles, ...newAdded];

      valuingUploadingFiles(newUploadingFiles);
      addToLinks(newAdded);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
        }}
      >
        <input {...getInputProps()} />

        {variant === 'witUi' && <BlockContent />}
      </DropZoneStyle>

      <video width="100%" height="300px" hidden ref={videoRef} id="thumbnail-video">
        <source />
      </video>
    </Box>
  );
};

export default GolUploader;
