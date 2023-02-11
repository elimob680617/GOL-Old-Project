import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import GoogleMapReact from 'google-map-react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Icon } from 'src/components/Icon';
import MediaCarousel from 'src/components/mediaCarousel';
import { PATH_APP } from 'src/routes/paths';
import ConnectionsOwnProfile from 'src/sections/profile/components/ConnectionsOwnProfile';
import ProfileOwnerPostTabs from 'src/sections/profile/components/ProfileOwnerPostTabs';
import NgoWizard from 'src/sections/profile/ngo/wizard/Wizard';
import getMonthName from 'src/utils/getMonthName';
import { useLazyGetCertificatesQuery } from 'src/_requests/graphql/profile/certificates/queries/getCertificates.generated';
import { useLazyGetProjectsQuery } from 'src/_requests/graphql/profile/mainProfileNOG/queries/getProject.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';
import Bio from './Bio';
import BGD from '/public/icons/mainNGO/BGD/Group3.svg';

const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: '360px',
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
const ProjectDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  textAlign: 'left',
}));
const ImageArrowDown = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  borderRadius: 9,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
const MapStyle = styled(Box)(({ theme }) => ({
  width: 328,
  height: 230,
  borderRadius: theme.spacing(1),
}));
const BgdStyle = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  position: 'absolute',
  right: theme.spacing(2),
  bottom: theme.spacing(15),
  zIndex: 1,
}));
const BioStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 1,
  padding: theme.spacing(2),
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
const Marker = ({ lat, lng, text }) => <Box>{text}</Box>;

export default function Main() {
  const router = useRouter();
  const [getNgoDetail, { data: ngoData, isFetching }] = useLazyGetUserDetailQuery();
  const [getProject, { data: projectData, isFetching: isFetchingProject }] = useLazyGetProjectsQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();

  useEffect(() => {
    if (router?.asPath === '/profile/ngo/') {
      getNgoDetail({ filter: { dto: {} } });
      getProject({ filter: { all: true, orderByDescendings: [true], orderByFields: ['CreatedDateTime'] } });
      getCertificates({ filter: { dto: {} } });
    }
  }, [getCertificates, getNgoDetail, getProject, router?.asPath]);

  const showDifferenceExp = (year: number, month: number) => {
    if (year === 0 && month === 0) return null;
    let finalValue = '';
    if (year > 0) finalValue = `${year} Year${year > 1 ? 's' : ''}  `;
    if (finalValue && month) finalValue += 'and ';
    if (month > 0) finalValue += `${month} Month${month > 1 ? 's' : ''}`;
    return <span>&#8226; {finalValue}</span>;
  };

  const ngo = ngoData?.getUser?.listDto?.items?.[0];
  const locatedIn = ngo?.organizationUserDto?.place?.description;
  const size = ngo?.organizationUserDto?.numberRange;
  const EstablishedDate = ngo?.organizationUserDto?.establishmentDate;
  const category = ngo?.organizationUserDto?.groupCategory;
  const emails = ngo?.contactInfoEmails;
  const phoneNumbers = ngo?.contactInfoPhoneNumbers;
  const socialLinks = ngo?.contactInfoSocialLinks;
  const websites = ngo?.contactInfoWebSites;
  const projects = projectData?.getProjects?.listDto?.items;
  const certificates = certificateData?.getCertificates?.listDto?.items;
  const hasPublicDetail = !!category || !!size || !!locatedIn;

  const handelEditPhotoCover = () => {
    if (ngo?.organizationUserDto?.coverUrl) {
      router.push(PATH_APP.profile.ngo.mainProfileNChangePhotoCover);
    } else {
      router.push(PATH_APP.profile.ngo.ngoEditCover);
    }
  };
  const handelEditPhotoAvatar = () => {
    if (ngo?.organizationUserDto?.avatarUrl) {
      router.push(PATH_APP.profile.ngo.mainProfileNChangePhotoAvatar);
    } else {
      router.push(PATH_APP.profile.ngo.ngoEditAvatar);
    }
  };

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
                    sx={{ cursor: 'pointer' }}
                    component="img"
                    alt="Cover Image"
                    height={'250px'}
                    image={ngo?.organizationUserDto?.coverUrl || '/icons/empty_cover.svg'}
                    onClick={handelEditPhotoCover}
                  />
                  <BgdStyle>
                    <Image src={BGD} alt="BGD" />
                  </BgdStyle>
                  <CardContentStyle>
                    <StackContentStyle>
                      <Box>
                        <Avatar
                          onClick={handelEditPhotoAvatar}
                          variant="rounded"
                          alt={ngo?.organizationUserDto?.fullName || ''}
                          src={ngo?.organizationUserDto?.avatarUrl || undefined}
                          sx={{ width: 80, height: 80, backgroundColor: 'background.neutral', cursor: 'pointer' }}
                        >
                          <Icon name="camera" type="solid" />
                        </Avatar>
                      </Box>
                    </StackContentStyle>
                    <Stack direction="row" justifyContent="space-between" mt={1}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography gutterBottom variant="subtitle1" sx={{ mt: 1 }}>
                            {ngo?.organizationUserDto?.fullName}
                          </Typography>
                          {ngo?.organizationUserDto?.fullName && (
                            <ImageArrowDown>
                              <Icon name="down-arrow" />
                            </ImageArrowDown>
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {ngo?.userType}
                        </Typography>
                      </Box>
                      <CardContentBtn>
                        <Button
                          size="large"
                          variant="contained"
                          onClick={() => router.push(PATH_APP.post.createPost.socialPost.index)}
                        >
                          <Icon name="Plus" color="background.paper" />
                          <Typography sx={{ ml: 1.5 }}>Add Post</Typography>
                        </Button>
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
                          <Icon name="public" color="text.secondary" />
                          <Typography sx={{ ml: 1.5 }} color="text.secondary">
                            Administrators
                          </Typography>
                        </Button>
                        <IconButton sx={{ ml: 3 }}>
                          <Icon name="Menu" color="text.primary" />
                        </IconButton>
                      </CardContentBtn>
                    </Stack>
                  </CardContentStyle>
                </CardStyle>
                <BioStyle spacing={3}>
                  <Bio text={ngo?.organizationUserDto?.bio} />
                </BioStyle>
                <NgoWizard percentage={ngo?.completeProfilePercentage || 0} fromHomePage={false} />
                <FollowersStyle>
                  <ConnectionsOwnProfile isOwn={ngo?.userType || undefined} />
                </FollowersStyle>
                <PostStyle spacing={3}>
                  <ProfileOwnerPostTabs />
                </PostStyle>
              </Stack>
            </Grid>
            <Grid item lg={4} xs={12}>
              <Stack spacing={3}>
                <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" color="text.primary">
                      Public Details
                    </Typography>
                    {hasPublicDetail && (
                      <NextLink href={PATH_APP.profile.ngo.publicDetails.main} passHref>
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                          Edit
                        </Typography>
                      </NextLink>
                    )}
                  </Box>
                  {!hasPublicDetail ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                          <Icon name="NGO" color="grey.500" />
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          NGO Category
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                          <Icon name="NGO" color="grey.500" />
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          NGO Size
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                          <Icon name="calendar" color="grey.500" />
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Date of Establishment
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                          <Icon name="City" color="grey.500" />
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Located in
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      {category && (
                        <Box
                          sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', gap: 0.5 }}
                          key={category.id}
                        >
                          <Box>
                            <Icon name="NGO" />
                          </Box>
                          <Typography variant="subtitle2" color="text.primary" component={'span'}>
                            NGO Category
                            <Typography
                              variant="subtitle2"
                              color="text.primary"
                              sx={{ fontWeight: 'Bold' }}
                              component={'span'}
                              ml={0.5}
                            >
                              {category.title}
                            </Typography>
                          </Typography>
                        </Box>
                      )}

                      {size && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', gap: 0.5 }}>
                          <Box>
                            <Icon name="NGO" />
                          </Box>
                          <Typography variant="subtitle2" color="text.primary" component={'span'}>
                            NGO Size
                            <Typography
                              variant="subtitle2"
                              color="text.primary"
                              sx={{ fontWeight: 'Bold' }}
                              component={'span'}
                              ml={0.5}
                            >
                              {size?.desc}
                            </Typography>
                          </Typography>
                        </Box>
                      )}

                      {EstablishedDate && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', gap: 0.5 }}>
                          <Box>
                            <Icon name="calendar" />
                          </Box>
                          <Typography variant="subtitle2" color="text.primary" component={'span'}>
                            Date of Establishment
                            <Typography
                              variant="subtitle2"
                              color="text.primary"
                              sx={{ mr: 1, fontWeight: 'Bold' }}
                              component={'span'}
                              ml={0.5}
                            >
                              {getMonthName(new Date(EstablishedDate))} {new Date(EstablishedDate).getFullYear()}
                            </Typography>
                          </Typography>
                        </Box>
                      )}

                      {locatedIn && (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', gap: 0.5 }}>
                            <Box>
                              <Icon name="City" />
                            </Box>
                            <Typography variant="subtitle2" color="text.primary" component={'span'}>
                              Located in
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                                sx={{ fontWeight: 'Bold' }}
                                component={'span'}
                                ml={0.5}
                              >
                                {!!ngo?.organizationUserDto?.address && `${ngo?.organizationUserDto?.address}, `}
                                {locatedIn}
                              </Typography>
                            </Typography>
                          </Box>
                          {ngo?.organizationUserDto?.placeId && (
                            <MapStyle>
                              <Box sx={{ height: 230, width: 328, '& div:nth-child(1)': { borderRadius: 1 } }}>
                                <GoogleMapReact
                                  bootstrapURLKeys={{ key: 'AIzaSyAeD8NNyr1bEJpjKnSHnKJQfj5j8Il7ct8' }}
                                  defaultCenter={{
                                    lat: ngo?.organizationUserDto?.lat,
                                    lng: ngo?.organizationUserDto?.lng,
                                  }}
                                  defaultZoom={13}
                                >
                                  <Marker
                                    lat={ngo?.organizationUserDto?.lat}
                                    lng={ngo?.organizationUserDto?.lng}
                                    text={<Icon name="location" type="solid" color="error.main" />}
                                  />
                                </GoogleMapReact>
                              </Box>
                            </MapStyle>
                          )}
                        </>
                      )}
                    </>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      <Icon name="Join-Calendar" color="text.secondary" />
                    </Box>
                    <Typography variant="body1" color="text.primary" component="span">
                      Joined Grdaen of love at
                      {ngo?.organizationUserDto?.joinDateTime && (
                        <Typography component="span" variant="subtitle2" sx={{ ml: 0.5, fontWeight: 'Bold' }}>
                          {getMonthName(new Date(ngo?.organizationUserDto?.joinDateTime))}{' '}
                          {new Date(ngo?.organizationUserDto?.joinDateTime).getFullYear()}
                        </Typography>
                      )}
                    </Typography>
                  </Box>

                  {!hasPublicDetail && (
                    <Box>
                      <NextLink href={PATH_APP.profile.ngo.publicDetails.main} passHref>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          sx={{ height: '40px', color: 'text.primary' }}
                          startIcon={<Icon name="Plus" color="text.primary" />}
                        >
                          Add Public Details
                        </Button>
                      </NextLink>
                    </Box>
                  )}
                </Stack>

                <Stack spacing={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                  {!!emails?.length || !!phoneNumbers?.length || !!socialLinks?.length || !!websites?.length ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" color="text.primary">
                          Contact Info
                        </Typography>

                        <NextLink href={PATH_APP.profile.ngo.contactInfo.root} passHref>
                          <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                            Edit
                          </Typography>
                        </NextLink>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                          Email
                        </Typography>
                        {isFetching ? (
                          <CircularProgress size={20} />
                        ) : (
                          emails?.map((email) => (
                            <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={email?.id}>
                              {email?.email}
                            </Typography>
                          ))
                        )}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                          Phone Number
                        </Typography>
                        {isFetching ? (
                          <CircularProgress size={20} />
                        ) : (
                          phoneNumbers?.map((phone) => (
                            <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={phone?.id}>
                              {phone?.phoneNumber}
                            </Typography>
                          ))
                        )}
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                          Social Links
                        </Typography>
                        {isFetching ? (
                          <CircularProgress size={20} />
                        ) : (
                          socialLinks?.map((social) => (
                            <Box sx={{ display: 'flex', alignItems: 'center' }} key={social?.id}>
                              <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                                {social?.socialMediaDto?.title}
                              </Typography>
                              <Typography variant="body2" color="text.primary" sx={{ pl: 1 }}>
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
                        {isFetching ? (
                          <CircularProgress size={20} />
                        ) : (
                          websites?.map((webSite) => (
                            <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={webSite?.id}>
                              {webSite?.webSiteUrl}
                            </Typography>
                          ))
                        )}
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" color="text.primary">
                          Contact Info
                        </Typography>
                      </Box>
                      <Box>
                        <NextLink href={PATH_APP.profile.ngo.contactInfo.root} passHref>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ height: '40px', color: 'text.primary', mt: 1 }}
                          >
                            <Icon name="Plus" color="text.primary" />
                            Add Contact Info
                          </Button>
                        </NextLink>
                      </Box>
                    </>
                  )}
                </Stack>

                <Stack spacing={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" color="text.primary">
                      Analytics
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={5.5}>
                    <Box>
                      <Typography variant="subtitle1" color="text.primary">
                        0
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Profile Views
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" color="text.primary">
                        0
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Profile Views
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" color="text.primary">
                        0
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Search appernce
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                  {projects?.length ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color="text.primary">
                          Project
                        </Typography>

                        <NextLink href="/profile/ngo/project-list" passHref>
                          <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                            Edit
                          </Typography>
                        </NextLink>
                      </Box>

                      {isFetchingProject ? (
                        <CircularProgress size={20} />
                      ) : (
                        projects?.slice(0, 1)?.map((project, index) => (
                          <Box key={project?.id}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                                {project?.title}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {getMonthName(new Date(project?.startDate)) +
                                  ' ' +
                                  new Date(project?.startDate).getFullYear() +
                                  ' - ' +
                                  (project?.endDate
                                    ? getMonthName(new Date(project?.startDate)) +
                                      ' ' +
                                      new Date(project?.startDate).getFullYear()
                                    : 'Present ')}
                                {!project?.endDate &&
                                  showDifferenceExp(
                                    project?.dateDiff?.years as number,
                                    project?.dateDiff?.months as number
                                  )}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {project?.cityDto?.name}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', pt: 1, alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                              <Box>
                                {project?.description && (
                                  <ProjectDescriptionStyle variant="body2">
                                    {project?.description.split('\n').map((str, i) => (
                                      <p key={i}>{str}</p>
                                    ))}
                                  </ProjectDescriptionStyle>
                                )}
                              </Box>
                              {project?.projectMedias && project?.projectMedias?.length > 0 && (
                                <Box maxHeight={184} maxWidth={328} mx={'auto'} mb={2} py={1}>
                                  <MediaCarousel media={project?.projectMedias} dots arrows height={184} width={328} />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        ))
                      )}
                      {projects.length - 1 > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                          <NextLink href={PATH_APP.profile.ngo.project.list} passHref>
                            <Button variant="text" size="small">
                              See {projects.length - 1} More Project
                            </Button>
                          </NextLink>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" color="text.primary">
                          Project
                        </Typography>
                      </Box>
                      <Box>
                        <NextLink href={PATH_APP.profile.ngo.project.list} passHref>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ height: '40px', color: 'text.primary', mt: 1 }}
                          >
                            <Icon name="Plus" color="text.primary" />
                            Add Project
                          </Button>
                        </NextLink>
                      </Box>
                    </>
                  )}
                </Stack>

                <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                  {certificates?.length ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color="text.primary">
                          Certificate
                        </Typography>

                        <NextLink href={PATH_APP.profile.ngo.certificate.add} passHref>
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
                              <Typography variant="caption" color="text.secondary">
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
                                <Typography variant="caption" color="text.secondary">
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
                          <NextLink href={PATH_APP.profile.ngo.certificate.root} passHref>
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
                        <Typography variant="subtitle1" color="text.primary">
                          Certificate
                        </Typography>
                      </Box>
                      <Box>
                        <NextLink href={PATH_APP.profile.ngo.certificate.root} passHref>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ height: '40px', color: 'text.primary' }}
                          >
                            <Icon name="Plus" color="text.primary" />
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
