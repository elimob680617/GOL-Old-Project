import {
  Dialog,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Divider,
  CircularProgress,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import {
  ArrowRight2,
  BookSaved,
  Briefcase,
  Camera,
  CloseCircle,
  Gallery,
  Like1,
  Link21,
  Mobile,
  Save2,
  TickCircle,
  UserTick,
} from 'iconsax-react';
import React, { useEffect } from 'react';
import { PathAppCaller, PATH_APP } from 'src/routes/paths';
import { useRouter } from 'next/router';
import { useLazyOrganizationProfileCompleteQuery } from 'src/_requests/graphql/profile/users/queries/organizationProfileComplete.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';
import { ProfileCompleteEnum } from 'src/@types/sections/serverTypes';
import sleep from 'src/utils/sleep';

function WizardList() {
  const theme = useTheme();
  const router = useRouter();

  const [profileComplete, { data }] = useLazyOrganizationProfileCompleteQuery();
  const [getUserDetail, { data: userData }] = useLazyGetUserDetailQuery();

  useEffect(() => {
    profileComplete({
      filter: {
        all: true,
      },
    });
    getUserDetail({ filter: { dto: {} } });
  }, []);

  const profileData = data?.organizationProfileComplete?.listDto?.items?.[0];
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
    } else router.push(PATH_APP.profile.ngo.root);
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
                  value={profileData?.completeProfilePercentage as number}
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
              <Typography
                variant="button"
                onClick={() => {
                  localStorage.removeItem('homePageWizard');
                  setTimeout(() => {
                    const paths = PathAppCaller();
                    router.push(paths.profile.ngo.root);
                  }, 200);
                }}
              >
                Open My Profile
              </Typography>
            </Button>
          </Box>
        </Stack>
        {/* ------------------------------------------Ngo Logo------------------------------------------- */}
        {!profileData?.ngoLogo ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => handleRoute(PATH_APP.profile.ngo.ngoEditAvatar)}
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
                  Your NGO Logo
                </Typography>
                <Typography variant="caption" color="grey.500">
                  Upload Your Official Logo Here
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.ngoEditAvatar)}>
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
                  Your NGO Logo Uploaded
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
            onClick={() => handleRoute(PATH_APP.profile.ngo.ngoEditCover)}
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
                  Related Picture to Your Category
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.ngoEditCover)}>
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
        {/* ------------------------------------------Bio------------------------------------------- */}
        {!profileData?.bio ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => {
              !profileData?.bio && handleRoute(PATH_APP.profile.ngo.bioDialog);
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
                <Save2 size={24} color={theme.palette.primary.main} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  Add Bio
                </Typography>
                <Typography variant="caption" color="grey.500">
                  Insert your Bio
                </Typography>
              </Stack>
            </Stack>
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                !profileData?.bio && handleRoute(PATH_APP.profile.ngo.bioDialog);
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
                <Save2 size={24} color={theme.palette.primary.light} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  Bio added
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Certificate------------------------------------------- */}
        {!profileData?.certificate ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => !profileData?.certificate && handleRoute(PATH_APP.profile.ngo.certificate.root)}
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
                <BookSaved size={24} color={theme.palette.primary.main} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  Add Certificate
                </Typography>
                <Typography variant="caption" color="grey.500">
                  Add your certificate
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.certificate.root)}>
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
                <BookSaved size={24} color={theme.palette.primary.light} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  Certificate added
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Public Details------------------------------------------- */}
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          onClick={() =>
            profileData?.profileDetails !== ProfileCompleteEnum.Complete &&
            handleRoute(PATH_APP.profile.ngo.publicDetails.main)
          }
          sx={{
            backgroundColor:
              profileData?.profileDetails === ProfileCompleteEnum.Nothing ? 'Background.paper' : 'grey.100',
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
                backgroundColor: profileData?.profileDetails === ProfileCompleteEnum.Nothing ? 'grey.100' : '#fff',
              }}
            >
              <UserTick
                size={24}
                color={
                  profileData?.profileDetails === ProfileCompleteEnum.Complete
                    ? theme.palette.primary.light
                    : theme.palette.primary.main
                }
              />
            </Avatar>
            <Stack spacing={0.5}>
              {profileData?.profileDetails === ProfileCompleteEnum.Complete ? (
                <Typography variant="subtitle2" color="grey.500">
                  Public Details Completed
                </Typography>
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.primary">
                    Public Details
                  </Typography>
                  {profileData?.profileDetails === ProfileCompleteEnum.Nothing ? (
                    <Typography variant="caption" color="grey.500">
                      Insert Your Public Details
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="grey.500">
                      Complete Your Public Details
                    </Typography>
                  )}
                </>
              )}
            </Stack>
          </Stack>
          <Box>
            {profileData?.profileDetails === ProfileCompleteEnum.Complete ? (
              <IconButton sx={{ padding: 0 }}>
                <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
              </IconButton>
            ) : (
              <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.publicDetails.main)}>
                <ArrowRight2 size={24} variant="Outline" color={theme.palette.grey[500]} />
              </IconButton>
            )}
          </Box>
        </Stack>
        {/* ------------------------------------------Project------------------------------------------- */}
        {!profileData?.projects ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => !profileData?.projects && handleRoute(PATH_APP.profile.ngo.project.list)}
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
                  Projects
                </Typography>
                <Typography variant="caption" color="grey.500">
                  Insert Your Projects
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.project.list)}>
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
                  Projects Completed
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Website Link------------------------------------------- */}
        {!profileData?.webSiteLinks ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => !profileData?.webSiteLinks && handleRoute(PATH_APP.profile.ngo.contactInfo.root)}
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
                <Link21 size={24} color={theme.palette.primary.main} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  Website Link
                </Typography>
                <Typography variant="caption" color="grey.500">
                  Insert Your Website Info
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.contactInfo.root)}>
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
                <Link21 size={24} color={theme.palette.primary.light} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  Website Link Completed
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Phone Number------------------------------------------- */}
        {!profileData?.phoneNumber ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => !profileData?.phoneNumber && handleRoute(PATH_APP.profile.ngo.contactInfo.root)}
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
                <Mobile size={24} color={theme.palette.primary.main} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  Phone Number
                </Typography>
                <Typography variant="caption" color="grey.500">
                  Insert Your Phone Number
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.contactInfo.root)}>
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
                <Mobile size={24} color={theme.palette.primary.light} />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  Phone Number Completed
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
