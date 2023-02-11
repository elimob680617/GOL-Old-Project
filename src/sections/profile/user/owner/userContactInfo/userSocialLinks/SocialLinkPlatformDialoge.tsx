import { Box, CircularProgress, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft, CloseSquare, Image as ImageIcon } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SocialMedia } from 'src/@types/sections/serverTypes';
import { addedSocialMedia, userSocialMediasSelector } from 'src/redux/slices/profile/socialMedia-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useGetSocialMediasQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getSocialMedias.generated';

function SocialLinkPlatformDialoge() {
  const router = useRouter();
  const dispatch = useDispatch();
  const personSocialMedia = useSelector(userSocialMediasSelector);
  useEffect(() => {
    if (!personSocialMedia) router.push(PATH_APP.profile.user.contactInfo.root);
  }, [personSocialMedia, router]);

  const { data, isFetching } = useGetSocialMediasQuery({
    filter: {
      all: true,
    },
  });

  const handleSelectPlatform = (social: SocialMedia) => {
    dispatch(
      addedSocialMedia({
        ...personSocialMedia,
        socialMediaDto: social,
      })
    );
    router.back();
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton>
            Select Platform
          </Typography>
          <IconButton onClick={() => router.back()}>
            <CloseSquare variant="Outline" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          {isFetching ? (
            <CircularProgress size={20} />
          ) : (
            data?.getSocialMedias?.listDto?.items?.map((item) => (
              <Box
                key={item?.id}
                onClick={() => handleSelectPlatform(item as SocialMedia)}
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Typography variant="body2" color="text.primary">
                  <IconButton sx={{ mr: 1 }}>
                    <ImageIcon size="16" variant="Linear" />
                  </IconButton>
                  {item?.title}
                </Typography>
              </Box>
            ))
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default SocialLinkPlatformDialoge;
