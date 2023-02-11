import { Box, Button, CircularProgress, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { Add, ArrowDown2, CloseSquare, Edit2, Eye, PictureFrame } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LocationType } from 'src/@types/sections/profile/publicDetails';
import { UserCollegeType } from 'src/@types/sections/profile/userColleges';
import { UserSchoolType } from 'src/@types/sections/profile/userSchools';
import {
  AudienceEnum,
  InstituteTypeEnum,
  Location,
  LocationTypeEnum,
  Relationship,
} from 'src/@types/sections/serverTypes';
import SvgIconStyle from 'src/components/SvgIconStyle';
import useAuth from 'src/hooks/useAuth';
import { userCollegeUpdated } from 'src/redux/slices/profile/userColloges-slice';
import { userLocationUpdated } from 'src/redux/slices/profile/userLocation-slice';
import { userRelationShipUpdate } from 'src/redux/slices/profile/userRelationShip-slice';
import { userSchoolUpdated } from 'src/redux/slices/profile/userSchool-slice';
import { userUniversityUpdated } from 'src/redux/slices/profile/userUniversity-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import { useLazyGetLocationQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getLocation.generated';
import { useLazyGetPersonCollegesQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getPersonColleges.generated';
import { useLazyGetPersonSchoolsQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getPersonSchools.generated';
import { useLazyGetRelationshipQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getRelationship.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';

export default function PublicDetailsMainDialog() {
  const router = useRouter();
  const theme = useTheme();
  const { initialize } = useAuth();
  const dispatch = useDispatch();
  //Query Services
  const [getPersonSchools, { data: personSchools, isFetching: schoolFetching }] = useLazyGetPersonSchoolsQuery();
  const [getPersonCollege, { data: personColleges, isFetching: collegeFetching }] = useLazyGetPersonCollegesQuery();
  const [getPersonUniversity, { data: personUniversities, isFetching: universityFetching }] =
    useLazyGetPersonCollegesQuery();
  const [getUser, { data: userData }] = useLazyGetUserDetailQuery();

  const [getRelationShips, { data: relationshipData, isFetching: loadingGetRelationship }] =
    useLazyGetRelationshipQuery();
  const [getCurrentCity, { data: currentCityData, isFetching }] = useLazyGetLocationQuery();

  const [getHomeTown, { data: homeTownData, isFetching: homeTownFetching }] = useLazyGetLocationQuery();

  useEffect(() => {
    getUser({ filter: { all: true } });
    getPersonSchools({ filter: { all: true } });
    getPersonCollege({ filter: { dto: { instituteType: InstituteTypeEnum.College } } });
    getPersonUniversity({ filter: { dto: { instituteType: InstituteTypeEnum.University } } });
    getRelationShips({ filter: { all: true } });
    getCurrentCity({ filter: { dto: { id: null, locationType: LocationTypeEnum.CurrnetCity } } });
    getHomeTown({ filter: { dto: { id: null, locationType: LocationTypeEnum.Hometown } } });
  }, [getCurrentCity, getHomeTown, getPersonCollege, getPersonSchools, getPersonUniversity, getRelationShips, getUser]);

  const handleEditCity = (city: Location) => {
    dispatch(userLocationUpdated(city));
    router.push(PATH_APP.profile.user.publicDetails.currentCity.edit);
  };
  const handleEditHomeTown = (city: Location) => {
    dispatch(userLocationUpdated(city));
    router.push(PATH_APP.profile.user.publicDetails.homeTown.edit);
  };
  const handleEditRelationship = (rel: Relationship) => {
    dispatch(userRelationShipUpdate(rel));
    router.push(PATH_APP.profile.user.publicDetails.relationship.edit);
  };

  //EditHandler
  const handleEditCollege = (currentCollege: UserCollegeType) => {
    dispatch(userCollegeUpdated(currentCollege));
    router.push(PATH_APP.profile.user.publicDetails.college.edit);
  };

  const handleEditSchool = (currentSchool: UserSchoolType) => {
    dispatch(userSchoolUpdated(currentSchool));
    router.push(PATH_APP.profile.user.publicDetails.school.edit);
  };

  const handleEditUniversity = (currentUni: UserCollegeType) => {
    dispatch(userUniversityUpdated(currentUni));
    router.push(PATH_APP.profile.user.publicDetails.university.edit);
  };

  const handleRoutingCurrentCity = (exp: LocationType) => {
    dispatch(userLocationUpdated(exp));
    router.push(PATH_APP.profile.user.publicDetails.currentCity.add);
  };
  const handleRoutingHomeTown = (exp: LocationType) => {
    dispatch(userLocationUpdated(exp));
    router.push(PATH_APP.profile.user.publicDetails.homeTown.add);
  };
  const handleRoutingRelationship = (exp: Relationship) => {
    dispatch(userRelationShipUpdate(exp));
    router.push(PATH_APP.profile.user.publicDetails.relationship.add);
  };
  const handleRoutingSchool = (school: UserSchoolType) => {
    dispatch(userSchoolUpdated(school));
    router.push(PATH_APP.profile.user.publicDetails.school.add);
  };
  const handleRoutingCollege = (college: UserCollegeType) => {
    dispatch(userCollegeUpdated(college));
    router.push(PATH_APP.profile.user.publicDetails.college.add);
  };
  const handleRoutingUni = (Uni: UserCollegeType) => {
    dispatch(userUniversityUpdated(Uni));
    router.push(PATH_APP.profile.user.publicDetails.university.add);
  };

  const user = userData?.getUser?.listDto?.items?.[0];

  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizard') === 'true';
    const fromHomePage = localStorage.getItem('fromHomePage') === 'true';
    if (fromWizard) {
      initialize();
      localStorage.removeItem('fromWizard');
      if (fromHomePage) {
        router.push(PATH_APP.home.wizard.wizardList);
      } else {
        router.push(PATH_APP.profile.user.wizard.wizardList);
      }
    } else {
      router.push(PATH_APP.profile.user.root);
    }
  }

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleClose}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <Typography variant="subtitle1" color="text.primary">
              Public Details
            </Typography>
          </Stack>
          <IconButton sx={{ p: 0 }} onClick={handleClose}>
            <CloseSquare variant="Outline" color={theme.palette.text.primary} />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Education
          </Typography>
          <Stack spacing={1}>
            {!!personSchools?.getPersonSchools?.listDto?.items?.length && (
              <Typography variant="subtitle2" color="text.primary">
                High School
              </Typography>
            )}
            {
              schoolFetching && <CircularProgress size={20} />
              //<LinearProgress/>
            }
            {personSchools?.getPersonSchools?.listDto?.items?.map((school: any) => (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                key={school?.school?.id}
              >
                <Stack direction="row" spacing={1} alignItems="center" key={school?.school?.id}>
                  <PictureFrame size="18" />
                  <Typography variant="body2" color="text.primary" key={school?.school?.id}>
                    Went
                  </Typography>
                  <Typography variant="subtitle2" color="text.primary" key={school?.school?.id}>
                    to {school?.school?.title}
                  </Typography>
                </Stack>
                <Box>
                  <IconButton onClick={() => handleEditSchool(school)}>
                    <Edit2 size="16" color={theme.palette.text.primary} />
                  </IconButton>
                </Box>
              </Stack>
            ))}
          </Stack>
          {/* <Link href="/profile/add-highSchool" passHref> */}
          <Button variant="outlined" onClick={() => handleRoutingSchool({ audience: AudienceEnum.Public })}>
            <Add color={theme.palette.text.primary} />
            <Typography color="text.primary">Add High School</Typography>
          </Button>
          {/* </Link> */}
          <Stack spacing={1}>
            {!!personColleges?.getPersonColleges?.listDto?.items?.length && (
              <Typography variant="subtitle2" color="text.primary">
                College
              </Typography>
            )}
            {collegeFetching && <CircularProgress size={20} />}
            {personColleges?.getPersonColleges?.listDto?.items?.map((college) => (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                key={college?.collegeDto?.id}
              >
                <Stack direction="row" spacing={1} key={college?.collegeDto?.id}>
                  <PictureFrame size="18" />
                  <Typography variant="body2" color="text.primary" key={college?.collegeDto?.id}>
                    Studied {college?.concentrationDto?.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.primary" key={college?.collegeDto?.id}>
                    at {college?.collegeDto?.name}
                  </Typography>
                </Stack>
                <Box onClick={() => handleEditCollege(college as UserCollegeType)}>
                  <IconButton>
                    <Edit2 size="16" variant="Outline" color={theme.palette.text.primary} />
                  </IconButton>
                </Box>
              </Stack>
            ))}
          </Stack>

          <Button variant="outlined" onClick={() => handleRoutingCollege({ audience: AudienceEnum.Public })}>
            <Add color={theme.palette.text.primary} />
            <Typography color="text.primary">Add College</Typography>
          </Button>

          <Stack spacing={1}>
            {!!personUniversities?.getPersonColleges?.listDto?.items?.length && (
              <Typography variant="subtitle2" color="text.primary">
                University
              </Typography>
            )}
            {universityFetching && <CircularProgress size={20} />}
            {personUniversities?.getPersonColleges?.listDto?.items?.map((university) => (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                key={university?.collegeDto?.id}
              >
                <Stack direction="row" spacing={1} key={university?.collegeDto?.id}>
                  <PictureFrame size="18" />
                  <Typography variant="body2" color="text.primary" key={university?.collegeDto?.id}>
                    Studied {university?.concentrationDto?.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.primary" key={university?.collegeDto?.id}>
                    at {university?.collegeDto?.name}
                  </Typography>
                  {/* <Typography variant="subtitle2" color="text.primary" key={university?.collegeDto?.id} noWrap={true} sx={{overflow:'hidden', width:'200px'}}>
                    at {university?.collegeDto?.name}
                  </Typography> */}
                </Stack>
                <IconButton onClick={() => handleEditUniversity(university as any)}>
                  <Edit2 size="16" color={theme.palette.text.primary} />
                </IconButton>
              </Stack>
            ))}
          </Stack>
          {/* <Link href="/profile/add-university" passHref> */}
          <Button variant="outlined" onClick={() => handleRoutingUni({ audience: AudienceEnum.Public })}>
            <Add color={theme.palette.text.primary} />
            <Typography color="text.primary">Add University</Typography>
          </Button>
          {/* </Link> */}
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Current City
          </Typography>
          {!!currentCityData?.getLocation?.listDto?.items?.length ? (
            currentCityData?.getLocation?.listDto?.items?.map((city) => (
              <Box key={city?.city?.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                    <SvgIconStyle src={`/icons/relationshipIcon.svg`} sx={{ width: 10, height: 10 }} />
                    <Typography variant="body2" color="text.primary" component="span">
                      Lives in
                      <Typography component="span" variant="subtitle2" sx={{ ml: 1 }}>
                        {city?.city?.name}
                      </Typography>
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleEditCity(city as Location)}>
                      <Edit2 variant="Outline" size="16" color={theme.palette.text.primary} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Button variant="outlined" onClick={() => handleRoutingCurrentCity({ audience: AudienceEnum.Public })}>
              {isFetching ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <Add color={theme.palette.text.primary} />
                  <Typography color="text.primary">Add Current City</Typography>
                </>
              )}
            </Button>
          )}
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Home Town
          </Typography>
          {!!homeTownData?.getLocation?.listDto?.items?.length ? (
            homeTownData?.getLocation?.listDto?.items?.map((city) => (
              <Box key={city?.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                    <SvgIconStyle src={`/icons/relationshipIcon.svg`} sx={{ width: 10, height: 10 }} />
                    <Typography variant="body2" color="text.primary" component="span" sx={{ mr: 1 }}>
                      From
                      <Typography component="span" variant="subtitle2" sx={{ ml: 1 }}>
                        {city?.city?.name}
                      </Typography>
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleEditHomeTown(city as Location)}>
                      <Edit2 variant="Outline" size="16" color={theme.palette.text.primary} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Button variant="outlined" onClick={() => handleRoutingHomeTown({ audience: AudienceEnum.Public })}>
              {homeTownFetching ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <Add color={theme.palette.text.primary} />
                  <Typography color="text.primary">Add Home Town</Typography>
                </>
              )}
            </Button>
          )}
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Relationship
          </Typography>
          {!!relationshipData?.getRelationship?.listDto?.items?.length ? (
            relationshipData?.getRelationship?.listDto?.items?.map((rel) => (
              <Box key={rel?.relationshipStatus?.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                    <Typography variant="subtitle2" color="text.primary" component="span" sx={{ mr: 1 }}>
                      {rel?.relationshipStatus?.title}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleEditRelationship(rel as Relationship)}>
                      <Edit2 variant="Outline" size="16" color={theme.palette.text.primary} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Button variant="outlined" onClick={() => handleRoutingRelationship({ audience: AudienceEnum.Public })}>
              {loadingGetRelationship ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <Add color={theme.palette.text.primary} />
                  <Typography color="text.primary">Add Relationship Status</Typography>
                </>
              )}
            </Button>
          )}
        </Stack>
        <Divider />
        <>
          <Stack spacing={2} sx={{ px: 2, pb: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Joined Garden of Love
            </Typography>
            <Box
              sx={{
                position: 'relative',
              }}
            >
              {user?.personDto?.joinDateTime && (
                <Typography variant="body2" color="text.primary">
                  {getMonthName(new Date(user?.personDto?.joinDateTime))}{' '}
                  {new Date(user?.personDto?.joinDateTime).getFullYear()}
                </Typography>
              )}

              <Box sx={{ position: 'absolute', left: '50%', transform: 'translate(-50%,-50%)', top: '50%' }}>
                <Link href={`/profile/user/select-audience-main?audience=${user?.personDto?.joinAudience}`} passHref>
                  <Button
                    variant="outlined"
                    startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                    endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
                  >
                    <Typography color={theme.palette.text.primary}>
                      {
                        Object.keys(AudienceEnum)[
                          Object.values(AudienceEnum).indexOf(user?.personDto?.joinAudience as AudienceEnum)
                        ]
                      }
                    </Typography>
                  </Button>
                </Link>
              </Box>
            </Box>
          </Stack>
          <Divider />
        </>
      </Stack>
    </Dialog>
  );
}
