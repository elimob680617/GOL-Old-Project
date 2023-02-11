// @mui
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Book1, Briefcase, Edit2, Heart, Location, LoginCurve, More, StopCircle } from 'iconsax-react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { VerificationStatusEnum } from 'src/@types/sections/serverTypes';
import { PATH_APP } from 'src/routes/paths';
import ConnectionsOwnProfile from 'src/sections/profile/components/ConnectionsOwnProfile';
import getMonthName from 'src/utils/getMonthName';
import { useLazyGetCertificatesQuery } from 'src/_requests/graphql/profile/certificates/queries/getCertificates.generated';
import { useLazyGetUserEmailsQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserEmails.generated';
import { useLazyGetUserPhoneNumbersQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserPhoneNumbers.generated';
import { useLazyGetUserSocialMediasQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserSocialMedias.generated';
import { useLazyGetUserWebSitesQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserWebSites.generated';
import { useLazyGetExperiencesQuery } from 'src/_requests/graphql/profile/experiences/queries/getExperiences.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';
import { useLazyGetPersonSkillsQuery } from 'src/_requests/graphql/profile/skills/queries/getPersonSkills.generated';
import ProfileOwnerPostTabs from 'src/sections/profile/components/ProfileOwnerPostTabs';
import Wizard from 'src/sections/profile/user/wizard/Wizard';
// import Camera from '/public/icons/camera.svg'

const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: '450px',
  borderRadius: theme.spacing(1),
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    minHeight: '520px',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '570px',
  },
}));

const CardContentStyle = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  position: 'absolute',
  top: '185px',
}));
const StackContentStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const CardContentBtn = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8.5),
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(2),
  },
}));

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(3, 0),
  // [theme.breakpoints.up('xl')]: {
  //   padding: theme.spacing(3, 19.5),
  // },
}));
const ExperienceDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,

  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  textAlign: 'left',
}));
const ExperienceImage = styled(Stack)(({ theme }) => ({
  maxHeight: '328px',
  minWidth: '184px',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
}));
const FollowersStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 1,
  padding: theme.spacing(2),
}));
const PostStyle = styled(Stack)(({ theme }) => ({
  borderRadius: 1,
}));
const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

export default function Main() {
  const router = useRouter();
  const theme = useTheme();
  const [getUserDetail, { data: userData }] = useLazyGetUserDetailQuery();
  const [getSocialLinks, { data: socialMediaData, isFetching: isFetchingSocialMedia }] =
    useLazyGetUserSocialMediasQuery();
  const [getSkills, { data: skillsData }] = useLazyGetPersonSkillsQuery();
  const [getExperiences, { data: experienceData, isFetching: isFetchingExprience }] = useLazyGetExperiencesQuery();
  const [getWebSites, { data: websitesData, isFetching: isFetchingWebsite }] = useLazyGetUserWebSitesQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();
  const [getUserEmails, { data: emailData, isFetching: isFetchingEmail }] = useLazyGetUserEmailsQuery();
  const [getUserPhoneNumbers, { data: phoneNumberData, isFetching: isFetchingPhoneNumber }] =
    useLazyGetUserPhoneNumbersQuery();

  useEffect(() => {
    if (router?.asPath === '/profile/user/') {
      getUserDetail({ filter: { dto: {} } });
      getSocialLinks({ filter: { dto: { id: null } } });
      getSkills({ filter: { dto: {} } });
      getExperiences({ filter: { all: true, orderByDescendings: [true], orderByFields: ['CreatedDateTime'] } });
      getWebSites({ filter: { all: true } });
      getCertificates({ filter: { dto: {} } });
      getUserEmails({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
      getUserPhoneNumbers({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
    }
  }, [
    getCertificates,
    getExperiences,
    getSkills,
    getSocialLinks,
    getUserDetail,
    getUserEmails,
    getUserPhoneNumbers,
    getWebSites,
    router?.asPath,
    router.query,
  ]);

  const showDifferenceExp = (year: number, month: number) => {
    if (year === 0 && month === 0) return null;
    let finalValue = '';

    if (year > 0) finalValue = `${year} Year${year > 1 ? 's' : ''}  `;
    if (finalValue && month) finalValue += 'and ';
    if (month > 0) finalValue += `${month} Month${month > 1 ? 's' : ''}`;
    return <span>&#8226; {finalValue}</span>;
  };

  const certificates = certificateData?.getCertificates?.listDto?.items;
  const experiences = experienceData?.getExpriences?.listDto?.items;
  const skills = skillsData?.getPersonSkills?.listDto?.items;
  const user = userData?.getUser?.listDto?.items?.[0];
  const hometown = user?.personDto?.hometown;
  const currentCity = user?.personDto?.currnetCity;
  const relationship = user?.personDto?.relationship;
  const userExperience = user?.personDto?.experience;
  const currentExperiences = user?.personDto?.personCurrentExperiences;
  const university = user?.personDto?.personUniversities;
  const schools = user?.personDto?.personSchools;
  const emails = emailData?.getUserEmails?.listDto?.items;
  const phoneNumbers = phoneNumberData?.getUserPhoneNumbers?.listDto?.items;
  const hasPublicDetail =
    !!userExperience ||
    !!currentExperiences?.length ||
    !!university?.length ||
    !!schools?.length ||
    !!currentCity ||
    !!hometown ||
    !!relationship;

  return (
    <>
      <Container
        maxWidth="lg"
        sx={(theme) => ({
          [theme.breakpoints.up('sm')]: {
            px: 0,
          },
        })}
      >
        <RootStyle>
          <Grid container spacing={3}>
            <Grid item lg={8} xs={12}>
              <Stack spacing={3}>
                <CardStyle>
                  <CardMedia
                    component="img"
                    alt="Cover Image"
                    height={'250px'}
                    image={user?.personDto?.coverUrl || '/icons/empty_cover.svg'}
                    onClick={() =>
                      router.push(
                        user?.personDto?.coverUrl
                          ? PATH_APP.profile.user.mainProfileChangeCoverUser
                          : PATH_APP.profile.user.mainProfileAddCoverUser
                      )
                    }
                  />

                  <CardContentStyle>
                    <StackContentStyle>
                      <Box>
                        <Avatar
                          onClick={() =>
                            router.push(
                              user?.personDto?.avatarUrl
                                ? PATH_APP.profile.user.mainProfileChangeAvatarUser
                                : PATH_APP.profile.user.mainProfileAddAvatarUser
                            )
                          }
                          alt={user?.personDto?.fullName || ''}
                          src={user?.personDto?.avatarUrl || undefined}
                          sx={{ width: 80, height: 80, backgroundColor: 'background.neutral' }}
                        >
                          <Image src="/icons/camera.svg" width={28} height={22} alt="avatar" />
                        </Avatar>
                        <Typography gutterBottom variant="subtitle1" sx={{ mt: 1 }}>
                          {user?.personDto?.firstName} {user?.personDto?.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user?.userType}
                        </Typography>
                      </Box>
                      <CardContentBtn>
                        <Button
                          size="large"
                          variant="contained"
                          onClick={() => router.push(PATH_APP.post.createPost.socialPost.index)}
                        >
                          <Add />
                          <Typography sx={{ ml: 1.5 }}>Add Post</Typography>
                        </Button>
                        <NextLink href={PATH_APP.profile.user.userEdit} passHref>
                          <Button
                            size="large"
                            variant="outlined"
                            sx={{
                              ml: 2,
                              '@media (max-width:425px)': {
                                mt: 2,
                                ml: 0,
                              },
                            }}
                          >
                            <Edit2 color={theme.palette.text.secondary} />
                            <Typography sx={{ ml: 1.5 }} color={theme.palette.text.secondary}>
                              Edit Profile
                            </Typography>
                          </Button>
                        </NextLink>
                        <IconButton sx={{ ml: 3 }}>
                          <More color={theme.palette.text.primary} />
                        </IconButton>
                      </CardContentBtn>
                    </StackContentStyle>
                    <Stack direction={'row'} sx={{ justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
                      <Stack alignItems="flex-start">
                        <Button size="small" variant="text" sx={{ minWidth: 'unset !important' }}>
                          {!user?.personDto?.currnetCity?.city?.name && (
                            <StopCircle color={theme.palette.text.primary} />
                          )}

                          <Typography
                            color={theme.palette.text.primary}
                            sx={{
                              ...(!user?.personDto?.currnetCity?.city?.name && {
                                ml: 1,
                              }),
                            }}
                          >
                            {user?.personDto?.currnetCity?.city?.name || 'Your Location'}
                          </Typography>
                        </Button>
                        <Button size="small" variant="text" sx={{ minWidth: 'unset !important' }}>
                          {!user?.personDto?.headline && <StopCircle color={theme.palette.text.primary} />}

                          <Typography
                            color={theme.palette.text.primary}
                            sx={{
                              ...(!user?.personDto?.headline && {
                                ml: 1,
                              }),
                            }}
                          >
                            {user?.personDto?.headline || 'Your Headline'}
                          </Typography>
                        </Button>
                      </Stack>
                      <Box>
                        <Box sx={{ backgroundColor: 'secondary.main', padding: '16px 8px', borderRadius: 1 }}>
                          <Typography color={theme.palette.background.paper}>BGD</Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContentStyle>
                </CardStyle>
                <Wizard percentage={user?.completeProfilePercentage || 0} fromHomePage={false} />
                <FollowersStyle>
                  <ConnectionsOwnProfile isOwn={user?.userType || undefined} />
                </FollowersStyle>
                <PostStyle spacing={3}>
                  <ProfileOwnerPostTabs />
                </PostStyle>
              </Stack>
            </Grid>
            <Grid item lg={4} xs={12}>
              <Stack spacing={3}>
                <Stack spacing={1} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" color={theme.palette.text.primary}>
                      Public Details
                    </Typography>
                    {hasPublicDetail && (
                      <NextLink href={PATH_APP.profile.user.publicDetails.root} passHref>
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                          Edit
                        </Typography>
                      </NextLink>
                    )}
                  </Box>
                  {!hasPublicDetail ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton>
                          <Briefcase color={theme.palette.text.secondary} />
                        </IconButton>

                        <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                          Occupation
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton>
                          <Book1 color={theme.palette.text.secondary} />
                        </IconButton>

                        <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                          Education
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton>
                          <Location color={theme.palette.text.secondary} />
                        </IconButton>

                        <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                          Current city
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton>
                          <Location color={theme.palette.text.secondary} />
                        </IconButton>

                        <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                          Hometown
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton>
                          <Heart color={theme.palette.text.secondary} />
                        </IconButton>

                        <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                          Relationship
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      {currentExperiences?.map((experience) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }} key={experience?.id}>
                          <IconButton>
                            <Briefcase color={theme.palette.text.primary} />
                          </IconButton>
                          <Typography variant="body1" color={theme.palette.text.primary} component="span">
                            {experience?.title}
                            <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                              At {experience?.companyDto?.title}
                            </Typography>
                          </Typography>
                        </Box>
                      ))}
                      {university?.map((uni) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }} key={uni?.id}>
                          <IconButton>
                            <Book1 color={theme.palette.text.primary} />
                          </IconButton>
                          <Typography variant="body1" color={theme.palette.text.primary} component="span">
                            Studied {uni?.concentrationDto?.title}
                            <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                              at {uni?.collegeDto?.name} From {getMonthName(new Date(uni?.startDate))}{' '}
                              {new Date(uni?.startDate).getFullYear()} until{' '}
                              {uni?.endDate
                                ? getMonthName(new Date(uni?.endDate)) + ' ' + new Date(uni?.endDate).getFullYear()
                                : 'Present'}
                            </Typography>
                          </Typography>
                        </Box>
                      ))}
                      {schools?.map((school) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }} key={school?.id}>
                          <IconButton>
                            <Book1 color={theme.palette.text.primary} />
                          </IconButton>
                          <Typography variant="body1" color={theme.palette.text.primary} component="span">
                            Went to {school?.school?.title}
                            {school?.year && (
                              <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                                at {school?.year}
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      ))}
                      {currentCity && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton>
                            <Location color={theme.palette.text.primary} />
                          </IconButton>

                          <Typography variant="body1" color={theme.palette.text.primary} component="span">
                            Lives in
                            <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                              {currentCity?.city?.name}
                            </Typography>
                          </Typography>
                        </Box>
                      )}

                      {hometown && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton>
                            <Location color={theme.palette.text.primary} />
                          </IconButton>

                          <Typography variant="body1" color={theme.palette.text.primary} component="span">
                            From
                            <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                              {hometown?.city?.name}
                            </Typography>
                          </Typography>
                        </Box>
                      )}
                      {relationship && (
                        <Box>
                          <IconButton>
                            <Heart color={theme.palette.text.primary} />
                          </IconButton>

                          <Typography
                            variant="subtitle2"
                            color={theme.palette.text.primary}
                            component="span"
                            sx={{ mr: 1 }}
                          >
                            {relationship?.relationshipStatus?.title}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton>
                      <LoginCurve color={theme.palette.text.primary} />
                    </IconButton>

                    <Typography variant="body1" color={theme.palette.text.primary} component="span">
                      Joined Garden of love at
                      {user?.personDto?.joinDateTime && (
                        <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                          {getMonthName(new Date(user?.personDto?.joinDateTime))}{' '}
                          {new Date(user?.personDto?.joinDateTime).getFullYear()}
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                  {/* ))} */}

                  {!hasPublicDetail && (
                    <Box>
                      <NextLink href={PATH_APP.profile.user.publicDetails.root} passHref>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          sx={{ height: '40px', color: 'text.primary' }}
                          startIcon={<Add color={theme.palette.text.primary} />}
                        >
                          Add Public Details
                        </Button>
                      </NextLink>
                    </Box>
                  )}
                </Stack>

                <Stack spacing={2} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 2 }}>
                  {!!emails?.length ||
                  !!phoneNumbers?.length ||
                  !!socialMediaData?.getUserSocialMedias?.listDto?.items?.length ||
                  !!websitesData?.getUserWebSites?.listDto?.items?.length ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          Contact Info
                        </Typography>

                        <NextLink href={PATH_APP.profile.user.contactInfo.root} passHref>
                          <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                            Edit
                          </Typography>
                        </NextLink>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                          Email
                        </Typography>
                        {isFetchingEmail ? (
                          <CircularProgress size={20} />
                        ) : (
                          emails?.map((email) => (
                            <Typography
                              variant="body2"
                              color={theme.palette.text.primary}
                              sx={{ pl: 1 }}
                              key={email?.id}
                            >
                              {email?.email}
                            </Typography>
                          ))
                        )}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                          Phone Number
                        </Typography>
                        {isFetchingPhoneNumber ? (
                          <CircularProgress size={20} />
                        ) : (
                          phoneNumbers?.map((phone) => (
                            <Typography
                              variant="body2"
                              color={theme.palette.text.primary}
                              sx={{ pl: 1 }}
                              key={phone?.id}
                            >
                              {phone?.phoneNumber}
                            </Typography>
                          ))
                        )}
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                          Social Links
                        </Typography>
                        {isFetchingSocialMedia ? (
                          <CircularProgress size={20} />
                        ) : (
                          socialMediaData?.getUserSocialMedias?.listDto?.items?.map((social) => (
                            <Box sx={{ display: 'flex', alignItems: 'center' }} key={social?.id}>
                              <Typography variant="body2" color={theme.palette.text.secondary} sx={{ pl: 1 }}>
                                {social?.socialMediaDto?.title}
                              </Typography>
                              <Typography variant="body2" color={theme.palette.text.primary} sx={{ pl: 1 }}>
                                {social?.userName}
                              </Typography>
                            </Box>
                          ))
                        )}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                          Website
                        </Typography>
                        {isFetchingWebsite ? (
                          <CircularProgress size={20} />
                        ) : (
                          websitesData?.getUserWebSites?.listDto?.items?.map((webSite) => (
                            <Typography
                              variant="body2"
                              color={theme.palette.text.primary}
                              sx={{ pl: 1 }}
                              key={webSite?.id}
                            >
                              {webSite?.webSiteUrl}
                            </Typography>
                          ))
                        )}
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          Contact Info
                        </Typography>
                      </Box>
                      <Box>
                        <NextLink href={PATH_APP.profile.user.contactInfo.root} passHref>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ height: '40px', color: 'text.primary', mt: 1 }}
                          >
                            <Add color={theme.palette.text.primary} />
                            Add Contact Info
                          </Button>
                        </NextLink>
                      </Box>
                    </>
                  )}
                </Stack>

                <Stack spacing={1} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 2 }}>
                  {experiences?.length ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          Experiences
                        </Typography>

                        <NextLink href={PATH_APP.profile.user.experience.root} passHref>
                          <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                            Edit
                          </Typography>
                        </NextLink>
                      </Box>

                      {isFetchingExprience ? (
                        <CircularProgress size={20} />
                      ) : (
                        experiences?.slice(0, 1)?.map((experience, index) => (
                          <Box key={experience?.id}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                                {experience?.title} at {experience?.companyDto?.title}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography variant="caption" color={theme.palette.text.secondary}>
                                {getMonthName(new Date(experience?.startDate)) +
                                  ' ' +
                                  new Date(experience?.startDate).getFullYear() +
                                  ' - ' +
                                  (experience?.endDate
                                    ? getMonthName(new Date(experience?.startDate)) +
                                      ' ' +
                                      new Date(experience?.startDate).getFullYear()
                                    : 'Present ')}
                                {showDifferenceExp(
                                  experience?.dateDiff?.years as number,
                                  experience?.dateDiff?.months as number
                                )}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color={theme.palette.text.secondary}>
                                {experience?.cityDto?.name}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <Box>
                                {experience?.description && (
                                  <ExperienceDescriptionStyle variant="body2">
                                    {experience?.description.split('\n').map((str, i) => (
                                      <p key={i}>{str}</p>
                                    ))}
                                  </ExperienceDescriptionStyle>
                                )}
                              </Box>
                              {experience?.mediaUrl && (
                                <ExperienceImage>
                                  <Image
                                    src={experience?.mediaUrl}
                                    width={'100%'}
                                    height={'100%'}
                                    alt="experience-picture"
                                  />
                                </ExperienceImage>
                              )}
                            </Box>

                            {index < experiences?.length - 1 && <Divider sx={{ mt: 2 }} />}
                          </Box>
                        ))
                      )}
                      {experiences.length - 1 > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                          <NextLink href={PATH_APP.profile.user.experience.root} passHref>
                            <Button variant="text" size="small">
                              See {experiences.length - 1} More Experiences
                            </Button>
                          </NextLink>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          Experiences
                        </Typography>
                      </Box>
                      <Box>
                        <NextLink href={PATH_APP.profile.user.experience.root} passHref>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ height: '40px', color: 'text.primary', mt: 1 }}
                          >
                            <Add color={theme.palette.text.primary} />
                            Add Experience
                          </Button>
                        </NextLink>
                      </Box>
                    </>
                  )}
                </Stack>

                <Stack spacing={2} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" color={theme.palette.text.primary}>
                      Skills and Endorsements
                    </Typography>
                    {!!skills?.length && (
                      <NextLink href={PATH_APP.profile.user.skill.root} passHref>
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                          Edit
                        </Typography>
                      </NextLink>
                    )}
                  </Box>
                  {!!skills?.length ? (
                    <>
                      {skills?.slice(0, 3)?.map((skill) => (
                        <Box key={skill?.skill?.id}>
                          <Typography variant="body2" color={theme.palette.text.primary} sx={{ display: 'flex' }}>
                            {skill?.skill?.title}
                            {!!skill?.endorsementsCount && (
                              <Typography variant="body2" sx={{ color: 'primary.main', pl: 1 }}>
                                {skill?.endorsementsCount}
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      ))}
                      {skills?.length - 3 > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                          <NextLink href={PATH_APP.profile.user.skill.root} passHref>
                            <Button variant="text" size="small">
                              See {skills.length - 3} More Skills and Endorsements
                            </Button>
                          </NextLink>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Box>
                      <NextLink href={PATH_APP.profile.user.skill.root} passHref>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          sx={{ height: '40px', color: 'text.primary' }}
                        >
                          <Add color={theme.palette.text.primary} />
                          Add Skills and Endorsements
                        </Button>
                      </NextLink>
                    </Box>
                  )}
                </Stack>

                <Stack spacing={1} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 2 }}>
                  {certificates?.length ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          Certificate
                        </Typography>

                        <NextLink href={PATH_APP.profile.user.certificate.add} passHref>
                          <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                            Edit
                          </Typography>
                        </NextLink>
                      </Box>
                      {isFetchingCertificate ? (
                        <CircularProgress size={20} />
                      ) : (
                        certificates.slice(0, 1).map((certificate) => (
                          <Box key={certificate?.id}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                                {certificate?.certificateName?.title}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color={theme.palette.text.secondary}>
                                {certificate?.issueDate &&
                                  `Issued ${getMonthName(new Date(certificate?.issueDate))}
                  ${new Date(certificate?.issueDate).getFullYear()}`}
                                {certificate?.issueDate && bull}
                                {certificate?.expirationDate
                                  ? ` ${getMonthName(new Date(certificate?.expirationDate))} ${new Date(
                                      certificate?.expirationDate
                                    ).getFullYear()} `
                                  : !certificate?.credentialDoesExpire && ' No Expiration Date'}
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                              Issuing organization: {certificate?.issuingOrganization?.title}
                            </Typography>
                            {certificate?.credentialID && (
                              <Box>
                                <Typography variant="caption" color={theme.palette.text.secondary}>
                                  Credential ID {certificate?.credentialID}
                                </Typography>
                              </Box>
                            )}
                            {certificate?.credentialUrl && (
                              <Box>
                                <NextLink
                                  href={'https://' + certificate?.credentialUrl.replace('https://', '')}
                                  passHref
                                >
                                  <Link target={'_blank'} underline="none">
                                    <Button
                                      size="small"
                                      color="inherit"
                                      variant="outlined"
                                      sx={{ borderColor: 'text.primary', color: 'text.primary', mt: 1, mb: 1 }}
                                    >
                                      <Typography variant="body2">see certificate</Typography>
                                    </Button>
                                  </Link>
                                </NextLink>
                              </Box>
                            )}
                          </Box>
                        ))
                      )}
                      {certificates.length - 1 > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                          <NextLink href={PATH_APP.profile.user.certificate.add} passHref>
                            <Button variant="text" size="small">
                              See {certificates.length - 1} More Certificate
                            </Button>
                          </NextLink>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          Certificate
                        </Typography>
                      </Box>
                      <Box>
                        <NextLink href={PATH_APP.profile.user.certificate.add} passHref>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ height: '40px', color: 'text.primary' }}
                          >
                            <Add color={theme.palette.text.primary} />
                            Add Certificate
                          </Button>
                        </NextLink>
                      </Box>
                    </>
                  )}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </RootStyle>
      </Container>
    </>
  );
}
