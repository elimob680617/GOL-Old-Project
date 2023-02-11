import { IconButton, Stack, styled, Typography } from '@mui/material';
import { FC, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector } from 'src/redux/store';
import { basicCreateSocialPostSelector, initialState } from 'src/redux/slices/post/createSocialPost';
import { PATH_APP } from 'src/routes/paths';
import ConfirmDialog from 'src/components/dialogs/ConfirmDialog';
import { getUploadingFiles } from 'src/redux/slices/upload';

const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));

interface ICreatePostMainHeaderProps {
  cancelAllUploads: () => void;
}

const CreatePostMainHeader: FC<ICreatePostMainHeaderProps> = (props) => {
  const { cancelAllUploads } = props;
  const { replace } = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const post = useSelector(basicCreateSocialPostSelector);
  const uploadingFiles = useSelector(getUploadingFiles);

  const needToConformDialog = () => {
    if (
      post.audience != initialState.audience ||
      post.gifs != initialState.gifs ||
      post.location != initialState.location ||
      // post.picturesUrls != initialState.picturesUrls ||
      post.text != initialState.text ||
      // post.videoUrls != initialState.videoUrls ||
      post.mediaUrls != initialState.mediaUrls ||
      uploadingFiles.length > 0
    ) {
      setShowConfirmDialog(true);
    } else {
      replace(PATH_APP.home.index, undefined, { shallow: true });
    }
  };

  return (
    <HeaderWrapperStyle direction="row" alignItems="center" justifyContent="space-between">
      <Typography
        variant="subtitle1"
        sx={{
          color: 'grey.900',
          fontWeight: 500,
        }}
      >
        Social post
      </Typography>
      <IconButton onClick={() => needToConformDialog()} sx={{ padding: 0 }}>
        <Image src="/icons/Close/24/Outline.svg" width={24} height={24} alt="" />
      </IconButton>

      <ConfirmDialog
        confirmText="Unsaved Data will be lost. Do you want to Continue?"
        actionButtonText="Confirm"
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        titleText="Exit Social Create Dialog"
        confirm={() => {
          cancelAllUploads();
          replace(PATH_APP.home.index);
        }}
      />
    </HeaderWrapperStyle>
  );
};

export default CreatePostMainHeader;
