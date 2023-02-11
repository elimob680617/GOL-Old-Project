import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ArrowRight2,
  Briefcase,
  Camera,
  CloseCircle,
  Gallery,
  Like1,
  Location,
  Math,
  TickCircle,
  UserTick,
} from 'iconsax-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { ProfileCompleteEnum } from 'src/@types/sections/serverTypes';
import { PathAppCaller, PATH_APP } from 'src/routes/paths';
import sleep from 'src/utils/sleep';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';
import { useLazyProfileCompleteQuery } from 'src/_requests/graphql/profile/users/queries/profileComplete.generated';

function WizardList() {
  const theme = useTheme();
  const router = useRouter();

  const [profileComplete, { data }] = useLazyProfileCompleteQuery();
  const [getUserDetail, { data: userData }] = useLazyGetUserDetailQuery();

  useEffect(() => {
    profileComplete({
      filter: {
        all: true,
      },
    });
    getUserDetail({ filter: { dto: {} } });
  }, []);

  const profileData = data?.profileComplete?.listDto?.items?.[0];
  const user = userData?.getUser?.listDto?.items?.[0];

  async function handleRoute(route: string) {
    localStorage.setItem('fromWizard', 'true');
    await sleep(100);
    PathAppCaller();
    await sleep(100);
    router.push(route);
  }

  function handleClose() {
    const fromHomePage = localStorage.getItem('homePageWizard');
    if (fromHomePage === 'true') {
      localStorage.removeItem('homePageWizard');
      router.push(PATH_APP.home.index);
    } else router.push(PATH_APP.profile.user.root);
  }

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={handleClose}>
      {/* ------------------------------------------Header------------------------------------------- */}
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1">Complete Your Profile</Typography>
        <Stack direction="row" spacing={2}>
          <IconButton sx={{ padding: 0 }} onClick={handleClose}>
            <CloseCircle variant="Outline" color={theme.palette.text.primary} />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />
      {/* ------------------------------------------Percentage Of Complete------------------------------------------- */}
      <Stack sx={{ mt: 3, mb: 2, px: 2 }} spacing={3} alignItems="center" justifyContent="space-between">
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          sx={{ backgroundColor: 'grey.100', width: '100%', px: 2, borderRadius: 1 }}
        >
          <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
            {profileData?.completeProfilePercentage === 100 ? (
              <Box sx={{ my: 1.7 }}>
                <Like1 variant="Bold" color={theme.palette.primary.main} />
              </Box>
            ) : (
              <Box>
                <CircularProgress
                  variant="determinate"
                  value={profileData?.completeProfilePercentage || undefined}
                  sx={{ my: 1, position: 'relative', zIndex: 10 }}
                />
                <CircularProgress
                  variant="determinate"
                  value={100}
                  sx={{ my: 1, position: 'absolute', ml: -5, color: 'grey.300', zIndex: 1 }}
                />
              </Box>
            )}
            <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
              <Typography variant="subtitle1" color="primary.main">
                {profileData?.completeProfilePercentage && user?.completeProfilePercentage + '%'}
              </Typography>
              <Typography variant="subtitle1" color="grey.500">
                Completed
              </Typography>
            </Stack>
          </Stack>
          <Box>
            <Button size="small" variant="text" color="info">
              <Typography variant="button" onClick={() => router.push(PATH_APP.profile.user.root)}>
                Open My Profile
              </Typography>
            </Button>
          </Box>
        </Stack>
        {/* ------------------------------------------Profile Picture------------------------------------------- */}
        {!profileData?.profilePicture ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() =>
              user?.personDto?.avatarUrl
                ? handleRoute(PATH_APP.profile.user.mainProfileChangeAvatarUser)
                : handleRoute(PATH_APP.profile.user.mainProfileAddAvatarUser)
            }
            sx={{
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'grey.100' }}>
                <Camera size={24} color={theme.palette.primary.main} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  Profile Picture
                </Typography>
                <Typography variant="caption" color="grey.500">
                  Upload Your Profile Picture
                </Typography>
              </Stack>
            </Stack>
            <IconButton
              sx={{ padding: 0 }}
              onClick={() =>
                user?.personDto?.avatarUrl
                  ? handleRoute(PATH_APP.profile.user.mainProfileChangeAvatarUser)
                  : handleRoute(PATH_APP.profile.user.mainProfileAddAvatarUser)
              }
            >
              <ArrowRight2 size={24} variant="Outline" color={theme.palette.grey[500]} />
            </IconButton>
          </Stack>
        ) : (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'background.paper' }}>
                <Camera size={24} color={theme.palette.primary.light} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  Profile Picture Uploaded
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Cover Photo------------------------------------------- */}
        {!profileData?.coverPhoto ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => {
              user?.personDto?.coverUrl
                ? handleRoute(PATH_APP.profile.user.mainProfileChangeCoverUser)
                : handleRoute(PATH_APP.profile.user.mainProfileAddCoverUser);
            }}
            sx={{
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'grey.100' }}>
                <Gallery size={24} color={theme.palette.primary.main} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  Cover Photo
                </Typography>
                <Typography variant="caption" color="grey.500">
                  Upload Your Cover Photo
                </Typography>
              </Stack>
            </Stack>
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                user?.personDto?.coverUrl
                  ? handleRoute(PATH_APP.profile.user.mainProfileChangeCoverUser)
                  : handleRoute(PATH_APP.profile.user.mainProfileAddCoverUser);
              }}
            >
              <ArrowRight2 size={24} variant="Outline" color={theme.palette.grey[500]} />
            </IconButton>
          </Stack>
        ) : (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'background.paper' }}>
                <Gallery size={24} color={theme.palette.primary.light} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  Cover Photo Uploaded
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Profile Information------------------------------------------- */}
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          onClick={() =>
            profileData?.profileInformation !== ProfileCompleteEnum.Complete &&
            handleRoute(PATH_APP.profile.user.userEdit)
          }
          sx={{
            backgroundColor:
              profileData?.profileInformation === ProfileCompleteEnum.Nothing ? 'Background.paper' : 'grey.100',
            border: 1,
            borderColor: 'grey.300',
            width: '100%',
            px: 2,
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Avatar
              alt="Profile Picture"
              sx={{
                my: 1,
                backgroundColor: profileData?.profileInformation === ProfileCompleteEnum.Nothing ? 'grey.100' : '#fff',
              }}
            >
              <UserTick
                size={24}
                color={
                  profileData?.profileInformation === ProfileCompleteEnum.Complete
                    ? theme.palette.primary.light
                    : theme.palette.primary.main
                }
              />
            </Avatar>
            <Stack spacing={0.5}>
              {profileData?.profileInformation === ProfileCompleteEnum.Complete ? (
                <Typography variant="subtitle2" color="grey.500">
                  Profile Info Completed
                </Typography>
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.primary">
                    Profile Informations
                  </Typography>
                  {profileData?.profileInformation === ProfileCompleteEnum.Nothing ? (
                    <Typography variant="caption" color="grey.500">
                      Insert Your Profile Info
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="grey.500">
                      Complete Your Profile Info
                    </Typography>
                  )}
                </>
              )}
            </Stack>
          </Stack>
          <Box>
            {profileData?.profileInformation === ProfileCompleteEnum.Complete ? (
              <IconButton sx={{ padding: 0 }}>
                <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
              </IconButton>
            ) : (
              <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.user.userEdit)}>
                <ArrowRight2 size={24} variant="Outline" color={theme.palette.grey[500]} />
              </IconButton>
            )}
          </Box>
        </Stack>
        {/* ------------------------------------------Location------------------------------------------- */}
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          onClick={() =>
            profileData?.location !== ProfileCompleteEnum.Complete &&
            handleRoute(PATH_APP.profile.user.publicDetails.root)
          }
          sx={{
            backgroundColor: profileData?.location === ProfileCompleteEnum.Complete ? 'grey.100' : 'background.paper',
            border: 1,
            borderColor: 'grey.300',
            width: '100%',
            px: 2,
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Avatar
              alt="Profile Picture"
              sx={{
                my: 1,
                backgroundColor: profileData?.location === ProfileCompleteEnum.Nothing ? 'grey.100' : '#fff',
              }}
            >
              <Location
                size={24}
                color={
                  profileData?.location === ProfileCompleteEnum.Complete
                    ? theme.palette.primary.light
                    : theme.palette.primary.main
                }
              />
            </Avatar>
            <Stack spacing={0.5}>
              {profileData?.location === ProfileCompleteEnum.Complete ? (
                <Typography variant="subtitle2" color="grey.500">
                  Location Info Completed
                </Typography>
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.primary">
                    Location
                  </Typography>
                  {profileData?.location === ProfileCompleteEnum.Nothing ? (
                    <Typography variant="caption" color="grey.500">
                      Insert Your Location Info
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="grey.500">
                      Complete Your Location Info
                    </Typography>
                  )}
                </>
              )}
            </Stack>
          </Stack>
          <Box>
            {profileData?.location === ProfileCompleteEnum.Complete ? (
              <IconButton sx={{ padding: 0 }}>
                <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
              </IconButton>
            ) : (
              <IconButton sx={{ padding: 0 }} onClick={() => router.push(PATH_APP.profile.user.publicDetails.root)}>
                <ArrowRight2 size={24} variant="Outline" color={theme.palette.grey[500]} />
              </IconButton>
            )}
          </Box>
        </Stack>
        {/* ------------------------------------------Exprience------------------------------------------- */}
        {!profileData?.experience ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => {
              !profileData?.experience && handleRoute(PATH_APP.profile.user.experience.root);
            }}
            sx={{
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'grey.100' }}>
                <Briefcase size={24} color={theme.palette.primary.main} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  Experience
                </Typography>
                <Typography variant="caption" color="grey.500">
                  Insert Your Experience Info
                </Typography>
              </Stack>
            </Stack>
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                handleRoute(PATH_APP.profile.user.experience.root);
              }}
            >
              <ArrowRight2 size={24} variant="Outline" color={theme.palette.grey[500]} />
            </IconButton>
          </Stack>
        ) : (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'background.paper' }}>
                <Briefcase size={24} color={theme.palette.primary.light} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  Exprience Info Completed
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Education------------------------------------------- */}
        {!profileData?.education ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => !profileData?.education && handleRoute(PATH_APP.profile.user.publicDetails.root)}
            sx={{
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'grey.100' }}>
                <Math size={24} color={theme.palette.primary.main} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  Education
                </Typography>
                <Typography variant="caption" color="grey.500">
                  Insert Your Education Info
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.user.publicDetails.root)}>
              <ArrowRight2 size={24} variant="Outline" color={theme.palette.grey[500]} />
            </IconButton>
          </Stack>
        ) : (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'background.paper' }}>
                <Math size={24} color={theme.palette.primary.light} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  Education Info Completed
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </Dialog>
  );
}

export default WizardList;
