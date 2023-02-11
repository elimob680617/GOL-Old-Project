import { Dialog, Divider, IconButton, Stack, Typography, Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CloseSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { experienceAdded, userExperienceSelector } from 'src/redux/slices/profile/userExperiences-slice';
import { LoadingButton } from '@mui/lab';
import { useUploadImageMutation } from 'src/_requests/graphql/upload/mutations/createFile.generated';
import { useSelector } from 'src/redux/store';
import { EntityType } from 'src/@types/sections/serverTypes';
import Cropper from 'src/components/Cropper';
import { PATH_APP } from 'src/routes/paths';

function ExperiencePhotoDialog() {
  const cropperRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [base64, setBase64] = useState<string | undefined>();
  const [image, setImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [uploadImage] = useUploadImageMutation();
  const experienceData = useSelector(userExperienceSelector);

  useEffect(() => {
    if (!experienceData) router.push(PATH_APP.profile.user.experience.root);
  }, [experienceData, router]);

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
        experienceAdded({
          mediaUrl: url,
          isChange: true,
        })
      );
      router.push(PATH_APP.profile.user.experience.add);
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
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle2" color="text.primary">
              Add Experience
            </Typography>
          </Stack>
          <IconButton onClick={() => router.back()}>
            <CloseSquare />
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

export default ExperiencePhotoDialog;
