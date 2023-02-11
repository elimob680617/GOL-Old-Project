import { IconButton } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageIcon from '/public/icons/comment/24/input/Image.svg';
import Image from 'next/image';
import { FILELIMITATION } from 'src/config';
import { convertToBase64 } from 'src/utils/fileFunctions';
import { v4 as uuidv4 } from 'uuid';
import Resumable from 'resumablejs';

interface ICommentImageProps {
  imagePreviewSelected: (preview: string) => void;
  removeFileFlag: number;
  uploadFileFlag: number;
  uploadedFile: (url: string) => void;
}

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

const CommentImage: FC<ICommentImageProps> = (props) => {
  const { imagePreviewSelected, removeFileFlag, uploadFileFlag, uploadedFile } = props;
  const [resumable, setResumable] = useState<Resumable>(new Resumable(config));
  const uploadServiceUrl = process.env.NEXT_UPLOAD_URL;
  const { getRootProps, getInputProps, isDragActive, acceptedFiles, open } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.bmp', '.gif'],
    },
    maxFiles: 1,
    maxSize: FILELIMITATION.image,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (acceptedFiles[0]) {
      setSelectedFile(acceptedFiles[0]);
      coverImageChoosed(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  const coverImageChoosed = async (file: File) => {
    const preview = await convertToBase64(file);
    imagePreviewSelected(preview);
  };

  useEffect(() => {
    if (!removeFileFlag) return;
    setSelectedFile(null);
  }, [removeFileFlag]);

  useEffect(() => {
    if (!uploadFileFlag) return;
    upload(selectedFile!);
  }, [uploadFileFlag]);

  const upload = (file: File) => {
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

  useEffect(() => {
    if (resumable) {
      resumable.on('fileSuccess', (file: Resumable.ResumableFile, message: string) => {
        uploadedFile(message.replace(/["']/g, ''));
      });

      //   resumable.on('fileError', (file, message) => {
      //     const uploadingFile = uploadingFilesref.current[0];
      //     if (uploadingFile.id === coverImageId) {
      //       toast.error('Cover image upload has error');
      //       removeCoverImage();
      //     }
      //     removeImage(uploadingFile.id);
      //     const newUploadingFiles = uploadingFilesref.current.splice(0, 0);
      //     uploadingFilesref.current = [...newUploadingFiles];
      //     getNextFile();
      //   });
    }
  }, [resumable]);

  return (
    <IconButton {...getRootProps()}>
      <Image src={imageIcon} alt="image" width={29} height={29} />
      <input {...getInputProps()} />
    </IconButton>
  );
};

export default CommentImage;
