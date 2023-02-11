// @mui
import { Box, Button, CircularProgress, Container, Grid, Link, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
//map
import GoogleMapReact from 'google-map-react';
//next
import NextLink from 'next/link';
// hooks
import { useRouter } from 'next/router';
import { useEffect } from 'react';
//component
import MediaCarousel from 'src/components/mediaCarousel';
//routes
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
//services
import { useLazyGetCertificatesQuery } from 'src/_requests/graphql/profile/certificates/queries/getCertificates.generated';
import { useLazyGetProjectsQuery } from 'src/_requests/graphql/profile/mainProfileNOG/queries/getProject.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';
import { ConnectionStatusEnum } from 'src/@types/sections/serverTypes';
// components
import ConnectionView from 'src/sections/profile/components/ConnectionView';
import ProfilePostTabs from '../../components/ProfilePostTabs';
import Bio from '../owner/ngoMain/Bio';
import RequestMessage from '../../components/RequestMessage';
import NgoInfoCard from './NgoInfoCard';
import { Icon } from 'src/components/Icon';

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(3, 0),
}));
const ProjectDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  textAlign: 'left',
}));
const MapStyle = styled(Box)(({ theme }) => ({
  width: 328,
  height: 230,
}));
const BioStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));
const ConnectionStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));
const PostStyle = styled(Stack)(({ theme }) => ({
  borderRadius: theme.spacing(1),
}));
const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);
const Marker = ({ lat, lng, text }) => <Box>{text}</Box>;

export default function NgoMainView() {
  const router = useRouter();
  const _Id = router?.query?.id?.[0];
  const theme = useTheme();
  const [getNgoDetail, { data: ngoData, isFetching: ngoFetching }] = useLazyGetUserDetailQuery();
  const [getProject, { data: projectData, isFetching: isFetchingProject }] = useLazyGetProjectsQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();

  useEffect(() => {
    if (_Id) {
      getNgoDetail({ filter: { dto: { id: _Id } } });
      getCertificates({ filter: { dto: { userId: _Id } } });
      getProject({ filter: { dto: { userId: _Id }, orderByDescendings: [true], orderByFields: ['CreatedDateTime'] } });
    }
  }, [_Id, getCertificates, getNgoDetail, getProject, ngoData]);

  const showDifferenceExp = (year: number, month: number) => {
    if (year === 0 && month === 0) return null;
    let finalValue = '';
    if (year > 0) finalValue = `${year} Year${year > 1 ? 's' : ''}  `;
    if (finalValue && month) finalValue += 'and ';
    if (month > 0) finalValue += `${month} Month${month > 1 ? 's' : ''}`;
    return <span>&#8226; {finalValue}</span>;
  };

  const ngo = ngoData?.getUser?.listDto?.items?.[0];
  const userBlockStatus = ngo?.connectionDto?.meBlockedOther || ngo?.connectionDto?.otherBlockedMe;
  const certificates = certificateData?.getCertificates?.listDto?.items;
  const projects = projectData?.getProjects?.listDto?.items;
  const locatedIn = ngo?.organizationUserDto?.place?.description;
  const size = ngo?.organizationUserDto?.numberRange;
  const EstablishedDate = ngo?.organizationUserDto?.establishmentDate;
  const category = ngo?.organizationUserDto?.groupCategory;
  const emails = ngo?.contactInfoEmails;
  const phoneNumbers = ngo?.contactInfoPhoneNumbers;
  const websites = ngo?.contactInfoWebSites;
  const socialMedias = ngo?.contactInfoSocialLinks;
  const hasPublicDetail = !!category || !!size || !!EstablishedDate || !!locatedIn;
  const hasContactInfo = !!emails?.length || !!phoneNumbers?.length || !!socialMedias?.length || !!websites?.length;

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
              {ngo?.connectionDto?.otherToMeStatus === ConnectionStatusEnum.Requested && (
                <RequestMessage
                  fullName={ngo?.organizationUserDto?.fullName || ''}
                  itemId={ngo?.connectionDto?.itemId}
                />
              )}
              <Stack spacing={3}>
                <NgoInfoCard ngo={ngo} itemId={ngo?.connectionDto?.itemId} />
                {!userBlockStatus && !ngo?.meReportedOther && (
                  <>
                    {!!ngo?.organizationUserDto?.bio?.length && (
                      <BioStyle spacing={3}>
                        <Bio text={ngo?.organizationUserDto?.bio} isReadOnly={true} />
                      </BioStyle>
                    )}
                    {/* SHOW CONNECTION */}
                    <ConnectionStyle>
                      <ConnectionView Name={ngo?.organizationUserDto?.fullName || ''} />
                    </ConnectionStyle>
                    {/* SHOW POST */}
                    <PostStyle spacing={3}>
                      <ProfilePostTabs Name={ngo?.organizationUserDto?.fullName || ''} />
                    </PostStyle>
                  </>
                )}
              </Stack>
            </Grid>
            {!userBlockStatus && !ngo?.meReportedOther && (
              <Grid item lg={4} xs={12}>
                <Stack spacing={3}>
                  {/* ---------------------------------public details-------------------------------------------- */}
                  <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                    {hasPublicDetail && (
                      <>
                        {category && (
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}
                            key={category.id}
                          >
                            <Box mr={0.5}>
                              <Icon name="NGO" />
                            </Box>
                            <Typography variant="body2" color="text.primary" component="span">
                              NGO Category
                              <Typography variant="subtitle2" color="text.primary" component="span" sx={{ pl: 1 }}>
                                {category.title}
                              </Typography>
                            </Typography>
                          </Box>
                        )}
                        {size && (
                          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
                            <Box mr={0.5}>
                              <Icon name="NGO" />
                            </Box>
                            <Typography variant="body2" color="text.primary" component="span">
                              NGO Size
                              <Typography variant="subtitle2" color="text.primary" component="span" sx={{ pl: 1 }}>
                                {size?.desc}
                              </Typography>
                            </Typography>
                          </Box>
                        )}
                        {EstablishedDate && (
                          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
                            <Box mr={0.5}>
                              <Icon name="calendar" />
                            </Box>
                            <Typography variant="body2" color="text.primary" component="span">
                              Date of Establishment
                              <Typography variant="subtitle2" color="text.primary" component="span" sx={{ pl: 1 }}>
                                {getMonthName(new Date(EstablishedDate))} {new Date(EstablishedDate).getFullYear()}
                              </Typography>
                            </Typography>
                          </Box>
                        )}
                        {locatedIn && (
                          <>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
                              <Box mr={0.5}>
                                <Icon name="City" />
                              </Box>
                              <Typography variant="body2" color="text.primary" component="span">
                                Located in
                                <Typography variant="subtitle2" color="text.primary" component="span" sx={{ pl: 1 }}>
                                  {!!ngo?.organizationUserDto?.address && `${ngo?.organizationUserDto?.address}, `}
                                  {locatedIn}
                                </Typography>
                              </Typography>
                            </Box>
                            {ngo?.organizationUserDto?.lat && (
                              <MapStyle>
                                <Box style={{ height: 230, width: 328 }}>
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
                                      text={
                                        <Box>
                                          <Icon name="location" type="solid" color="error.main" />
                                        </Box>
                                      }
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
                      <Box mr={0.5}>
                        <Icon name="Join-Calendar" />
                      </Box>
                      <Typography variant="body1" color="text.primary" component="span">
                        Joined Grdaen of love at
                        {ngo?.organizationUserDto?.joinDateTime && (
                          <Typography component="span" variant="subtitle2" sx={{ pl: 0.5 }}>
                            {getMonthName(new Date(ngo?.organizationUserDto?.joinDateTime))}{' '}
                            {new Date(ngo?.organizationUserDto?.joinDateTime).getFullYear()}
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* ---------------------------------contact info-------------------------------------------- */}
                  {!!hasContactInfo && (
                    <Stack spacing={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" color="text.primary">
                          Contact Info
                        </Typography>
                      </Box>
                      {!!emails?.length && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                            Email
                          </Typography>
                          {ngoFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            emails?.slice(0, 2)?.map((email) => (
                              <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={email?.id}>
                                {email?.email}
                              </Typography>
                            ))
                          )}
                        </Box>
                      )}
                      {!!phoneNumbers?.length && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                            Phone Number
                          </Typography>
                          {ngoFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            phoneNumbers?.slice(0, 2)?.map((phone) => (
                              <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={phone?.id}>
                                {phone?.phoneNumber}
                              </Typography>
                            ))
                          )}
                        </Box>
                      )}
                      {!!socialMedias?.length && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                            Social Links
                          </Typography>
                          {ngoFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            socialMedias?.slice(0, 5)?.map((social) => (
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
                      )}
                      {!!websites?.length && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                            Website
                          </Typography>
                          {ngoFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            websites?.slice(0, 2)?.map((webSite) => (
                              <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={webSite?.id}>
                                {webSite?.webSiteUrl}
                              </Typography>
                            ))
                          )}
                        </Box>
                      )}

                      {((emails && emails?.length > 2) ||
                        (phoneNumbers && phoneNumbers?.length > 2) ||
                        (socialMedias && socialMedias?.length > 5) ||
                        (websites && websites?.length > 2)) && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                          <NextLink href={`contactInfos/${_Id}`} passHref>
                            <Button variant="text" size="small">
                              Show All Contact Info
                            </Button>
                          </NextLink>
                        </Box>
                      )}
                    </Stack>
                  )}

                  {/* ---------------------------------analytics------------------- */}
                  <Stack>
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
                  </Stack>

                  {/* -----------------------------------------------projects---------------------------------------- */}
                  {!!projects?.length && (
                    <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color="text.primary">
                          Project
                        </Typography>
                      </Box>

                      {projects?.slice(0, 3)?.map((project, index) => (
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
                                  {project?.description?.split('\n').map((str, i) => (
                                    <p key={i}>{str}</p>
                                  ))}
                                </ProjectDescriptionStyle>
                              )}
                            </Box>
                            {!!project?.projectMedias?.length && (
                              <Box maxHeight={184} maxWidth={328} mx={'auto'} mb={2} py={1}>
                                <MediaCarousel media={project?.projectMedias} dots arrows height={184} width={328} />
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ))}
                      {projects?.length - 3 > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                          <NextLink href={`/profile/ngo/view/projects/${_Id}`} passHref>
                            <Button variant="text" size="small">
                              See {projects?.length - 3} More Project
                            </Button>
                          </NextLink>
                        </Box>
                      )}
                    </Stack>
                  )}

                  {/* -------------------------------certificate-------------------------------- */}
                  {!!certificates?.length && (
                    <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color="text.primary">
                          Certificate
                        </Typography>
                      </Box>
                      {certificates.slice(0, 3).map((certificate) => (
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
                              <NextLink href={'https://' + certificate?.credentialUrl.replace('https://', '')} passHref>
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
                      ))}
                      {certificates?.length - 3 > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                          <NextLink href={PATH_APP.profile.ngo.certificate.root} passHref>
                            <Button variant="text" size="small">
                              See {certificates?.length - 3} More Certificate
                            </Button>
                          </NextLink>
                        </Box>
                      )}
                    </Stack>
                  )}
                </Stack>
              </Grid>
            )}
          </Grid>
        </RootStyle>
      </Container>
    </>
  );
}
