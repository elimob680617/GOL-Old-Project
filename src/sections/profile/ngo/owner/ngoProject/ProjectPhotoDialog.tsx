import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EntityType } from 'src/@types/sections/serverTypes';
import Cropper from 'src/components/Cropper';
import { Icon } from 'src/components/Icon';
import { ngoProjectSelector, projectAdded } from 'src/redux/slices/profile/ngoProject-slice';
import { useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUploadImageMutation } from 'src/_requests/graphql/upload/mutations/createFile.generated';

function ProjectPhotoDialog() {
  const cropperRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [base64, setBase64] = useState<string | undefined>();
  const [image, setImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [uploadImage] = useUploadImageMutation();
  const projectData = useSelector(ngoProjectSelector);

  useEffect(() => {
    if (!projectData) router.push(PATH_APP.profile.ngo.project.list);
  }, [projectData, router]);

  const onCrop = async () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    // setImageCropper(cropper.getCroppedCanvas().toDataURL());
    setIsLoading(true);
    const res: any = await uploadImage({
      file: {
        dto: {
          entityType: EntityType.Person,
          type: image?.type?.split('/')[1],
          name: image?.name,
          binary: cropper.getCroppedCanvas().toDataURL().split(',')[1],
        },
      },
    });

    if (res?.data?.createFile?.isSuccess) {
      const url = res?.data!.createFile!.listDto!.items?.[0]!.url as string;
      dispatch(
        projectAdded({
          projectMedias: projectData?.projectMedias?.length ? [...projectData?.projectMedias, { url }] : [{ url }],
          isChange: true,
        })
      );
      router.push(PATH_APP.profile.ngo.project.new);
    }
    setIsLoading(false);
  };

  const onSelectFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setBase64(reader.result as string);
        setImage(e.target.files[0]);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (inputRef) {
        inputRef.current?.click();
      }
    }, 100);
  }, [inputRef]);

  return (
    <>
      <Dialog open fullWidth onClose={() => router.back()}>
        <input
          type="file"
          hidden
          ref={inputRef}
          style={{ display: 'hidden' }}
          id="photo-upload-experience"
          accept="image/*"
          onChange={onSelectFile}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle2" color="text.primary">
              Add Media
            </Typography>
          </Stack>
          <IconButton onClick={() => router.back()}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider sx={{ height: 2 }} />
        <Box sx={{ py: 2, textAlign: 'center', px: 17 }}>
          {base64 && (
            <Cropper
              src={base64}
              // Cropper.js options
              // background={false}
              guides={true}
              modal={false}
              // crop={onCrop}
              ref={cropperRef}
              aspectRatio={1 / 1}
              checkOrientation={false}
              // cropend={onCrop}
              zoomTo={0.5}
              viewMode={1}
              cropBoxResizable={false}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              toggleDragModeOnDblclick={false}
            />
          )}
          {base64 && <Box sx={{ mt: 2 }} />}
          <LoadingButton
            loading={isLoading}
            onClick={() => (base64 ? onCrop() : inputRef.current?.click())}
            sx={{ width: '100%' }}
            variant="contained"
          >
            {base64 ? 'Save' : 'Add'}
          </LoadingButton>
        </Box>
      </Dialog>
    </>
  );
}

export default ProjectPhotoDialog;
