import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Cropper from 'src/components/Cropper';
import { useDispatch } from 'react-redux';
import { EntityType } from 'src/@types/sections/serverTypes';
import { updateMainInfo, userMainInfoSelector } from 'src/redux/slices/profile/userMainInfo-slice';
import { useSelector } from 'src/redux/store';
import { useUploadImageMutation } from 'src/_requests/graphql/upload/mutations/createFile.generated';
import { PATH_APP } from 'src/routes/paths';

interface MainProfileCoverAvatarProps {
  isAvatar?: boolean;
}

function MainProfileCoverAvatarDialog(props: MainProfileCoverAvatarProps) {
  const { isAvatar = false } = props;
  const [isLoading, setIsLoading] = useState(false);
  const cropperRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [base64, setBase64] = useState<string | undefined>();
  const [image, setImage] = useState<any>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [uploadImage] = useUploadImageMutation();
  const userMainInfo = useSelector(userMainInfoSelector);

  useEffect(() => {
    if (!userMainInfo) router.push(PATH_APP.profile.user.userEdit);
  }, [userMainInfo, router]);

  const onCrop = async () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
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
      if (isAvatar) {
        dispatch(
          updateMainInfo({
            avatarUrl: url,
          })
        );
      } else {
        dispatch(
          updateMainInfo({
            coverUrl: url,
          })
        );
      }
      router.push(PATH_APP.profile.user.userEdit);
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
      <Dialog open fullWidth>
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
              {isAvatar ? 'Avatar' : 'Cover'}
            </Typography>
          </Stack>
          {/* <IconButton onClick={() => router.push( PATH_APP.profile.user.userEdit)}>
            <CloseSquare />
          </IconButton> */}
        </Stack>
        <Divider sx={{ height: 2 }} />
        <Box
          sx={{
            py: 2,
            textAlign: 'center',
            px: 17,
          }}
        >
          {base64 && (
            <Cropper
              src={base64}
              isRounded={isAvatar}
              // Cropper.js options
              // background={false}
              initialAspectRatio={16 / 9}
              guides={true}
              modal={true}
              dragMode="none"
              ref={cropperRef}
              checkOrientation={false}
              viewMode={1}
              cropBoxResizable={false}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              toggleDragModeOnDblclick={false}
              zoomable={true}
              scalable={false}
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

export default MainProfileCoverAvatarDialog;
