import { Box, CircularProgress, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SocialMedia } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { addedSocialMedia, userSocialMediasSelector } from 'src/redux/slices/profile/socialMedia-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useGetSocialMediasQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getSocialMedias.generated';

function SocialLinkPlatformDialoge() {
  const router = useRouter();
  const dispatch = useDispatch();
  const personSocialMedia = useSelector(userSocialMediasSelector);

  useEffect(() => {
    if (!personSocialMedia) router.push(PATH_APP.profile.ngo.contactInfo.root);
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
              <Icon name="left-arrow-1" />
            </IconButton>
            Select Platform
          </Typography>
          <IconButton onClick={() => router.back()}>
            <Icon name="Close-1" />
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
                    <Icon name="image" />
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
