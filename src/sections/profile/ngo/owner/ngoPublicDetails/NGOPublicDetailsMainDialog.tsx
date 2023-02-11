import { Box, Button, CircularProgress, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  EstablishmentdDatePayloadType,
  GroupCategoryPayloadType,
  NumberRangePayloadType,
  PlacePayloadType,
} from 'src/@types/sections/profile/ngoPublicDetails';
import { AudienceEnum, NumberRange } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import SvgIconStyle from 'src/components/SvgIconStyle';
import useAuth from 'src/hooks/useAuth';
import {
  ngoCategoryUpdated,
  ngoEstablishmentDateUpdated,
  ngoPlaceUpdated,
  ngoSizeUpdated,
} from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';

export default function NGOPublicDetailsMainDialog() {
  const router = useRouter();
  const { initialize } = useAuth();
  const dispatch = useDispatch();

  const [getNgo, { data: ngoData, isFetching }] = useLazyGetUserDetailQuery();

  useEffect(() => {
    getNgo({ filter: { all: true } });
  }, [getNgo]);
  const handleEditCategory = (category: GroupCategoryPayloadType, audience: AudienceEnum) => {
    dispatch(ngoCategoryUpdated({ ...category, categoryAudience: audience }));
    router.push(PATH_APP.profile.ngo.publicDetails.ngoCategory.editCategory);
  };
  const handleEditSize = (Size: NumberRange, audience: AudienceEnum) => {
    dispatch(ngoSizeUpdated({ ...Size, sizeAudience: audience, desc: size?.desc as string }));
    router.push(PATH_APP.profile.ngo.publicDetails.ngoSize.editSize);
  };
  const handleEditEstablishedDate = (date: Date, audience: AudienceEnum) => {
    dispatch(ngoEstablishmentDateUpdated({ establishmentDate: new Date(date), establishmentDateAudience: audience }));
    router.push(PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate.editDate);
  };
  const handleEditLocation = (location: PlacePayloadType, audience: AudienceEnum, address, lat, lng) => {
    dispatch(
      ngoPlaceUpdated({
        ...location,
        placeAudience: audience,
        address,
        lat,
        lng,
        description: location.description as string,
      })
    );
    router.push(PATH_APP.profile.ngo.publicDetails.ngoPlace.editLocation);
  };
  const handleRoutingCategory = (exp: GroupCategoryPayloadType) => {
    dispatch(ngoCategoryUpdated(exp));
    router.push(PATH_APP.profile.ngo.publicDetails.ngoCategory.root);
  };
  const handleRoutingSize = (exp: NumberRangePayloadType) => {
    dispatch(ngoSizeUpdated(exp));
    router.push(PATH_APP.profile.ngo.publicDetails.ngoSize.root);
  };
  const handleRoutingEstablishedDate = (exp: EstablishmentdDatePayloadType) => {
    dispatch(ngoEstablishmentDateUpdated(exp));
    router.push(PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate.root);
  };
  const handleRoutingLocation = (exp: PlacePayloadType) => {
    dispatch(ngoPlaceUpdated(exp));
    router.push(PATH_APP.profile.ngo.publicDetails.ngoPlace.root);
  };
  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizard') === 'true';
    const fromHomePage = localStorage.getItem('fromHomePage') === 'true';
    if (fromWizard) {
      initialize();
      localStorage.removeItem('fromWizard');
      if (fromHomePage) {
        router.push(PATH_APP.home.wizard.wizardList);
      } else {
        router.push(PATH_APP.profile.ngo.wizard.wizardList);
      }
    } else {
      router.push(PATH_APP.profile.ngo.root);
    }
  }

  const currentNGO = ngoData?.getUser?.listDto?.items?.[0];
  const category = currentNGO?.organizationUserDto?.groupCategory;
  const size = currentNGO?.organizationUserDto?.numberRange;
  const locatedIn = currentNGO?.organizationUserDto?.place;

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
            <Icon name="Close-1" />
          </IconButton>
        </Stack>

        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            NGO Category
          </Typography>
          {!!category ? (
            <Box key={category?.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                  <SvgIconStyle src={category?.iconUrl as string} />
                  <Typography component="span" variant="body2">
                    {category?.title}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() =>
                      handleEditCategory(
                        currentNGO?.organizationUserDto?.groupCategory as GroupCategoryPayloadType,
                        currentNGO?.organizationUserDto?.groupCategoryAudience as AudienceEnum
                      )
                    }
                  >
                    <Icon name="Edit-Pen" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ) : (
            <Button
              variant="outlined"
              onClick={() => handleRoutingCategory({ categoryAudience: AudienceEnum.Public })}
              disabled={isFetching}
            >
              {isFetching ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <Icon name="Plus" color="text.primary" />
                  <Typography color="text.primary">Add NGO Category</Typography>
                </>
              )}
            </Button>
          )}
        </Stack>

        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            NGO Size
          </Typography>
          {!!size ? (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                  <Typography component="span" variant="subtitle2">
                    {size?.desc}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() =>
                      handleEditSize(
                        currentNGO?.organizationUserDto?.numberRange as NumberRange,
                        currentNGO?.organizationUserDto?.sizeAudience as AudienceEnum
                      )
                    }
                  >
                    <Icon name="Edit-Pen" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ) : (
            <Button
              variant="outlined"
              onClick={() => handleRoutingSize({ sizeAudience: AudienceEnum.Public })}
              disabled={isFetching}
            >
              {isFetching ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <Icon name="Plus" color="text.primary" />
                  <Typography color="text.primary">Add NGO Size</Typography>
                </>
              )}
            </Button>
          )}
        </Stack>

        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Date of Establishment
          </Typography>
          {!!currentNGO?.organizationUserDto?.establishmentDate ? (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                  <Typography variant="subtitle2" color="text.primary" component="span">
                    {getMonthName(new Date(currentNGO?.organizationUserDto.establishmentDate))},{' '}
                    {new Date(currentNGO?.organizationUserDto.establishmentDate).getFullYear()}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() =>
                      handleEditEstablishedDate(
                        currentNGO?.organizationUserDto?.establishmentDate as Date,
                        currentNGO?.organizationUserDto?.establishmentDateAudience as AudienceEnum
                      )
                    }
                  >
                    <Icon name="Edit-Pen" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ) : (
            <Button
              variant="outlined"
              onClick={() => handleRoutingEstablishedDate({ establishmentDateAudience: AudienceEnum.Public })}
              disabled={isFetching}
            >
              {isFetching ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <Icon name="Plus" color="text.primary" />
                  <Typography color="text.primary">Add Date of Establishment</Typography>
                </>
              )}
            </Button>
          )}
        </Stack>

        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Located in
          </Typography>
          {!!locatedIn ? (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', gap: 2 }}>
                  <Icon name="Company-Logo-Empty" />
                  <Typography variant="body2" color="text.primary" component="span">
                    Located in
                    <Typography variant="subtitle2" color="text.primary" component="span" ml={1}>
                      {!!currentNGO?.organizationUserDto?.address && `${currentNGO?.organizationUserDto?.address}, `}
                      {currentNGO?.organizationUserDto?.place?.description}
                    </Typography>
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() =>
                      handleEditLocation(
                        currentNGO?.organizationUserDto?.place as PlacePayloadType,
                        currentNGO?.organizationUserDto?.placeAudience as AudienceEnum,
                        currentNGO?.organizationUserDto?.address,
                        currentNGO?.organizationUserDto?.lat,
                        currentNGO?.organizationUserDto?.lng
                      )
                    }
                  >
                    <Icon name="Edit-Pen" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ) : (
            <Button
              variant="outlined"
              onClick={() => handleRoutingLocation({ placeAudience: AudienceEnum.Public })}
              disabled={isFetching}
            >
              {isFetching ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <Icon name="Plus" color="text.primary" />
                  <Typography color="text.primary">Add Location</Typography>
                </>
              )}
            </Button>
          )}
        </Stack>

        <Divider />
        <Stack spacing={2} sx={{ px: 2, pb: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Joined Garden of Love
          </Typography>
          <Box
            sx={{
              position: 'relative',
            }}
          >
            {currentNGO?.organizationUserDto?.joinDateTime && (
              <Typography variant="body2" color="text.primary">
                {getMonthName(new Date(currentNGO?.organizationUserDto?.joinDateTime))}{' '}
                {new Date(currentNGO?.organizationUserDto?.joinDateTime).getFullYear()}
              </Typography>
            )}

            <Box sx={{ position: 'absolute', left: '50%', transform: 'translate(-50%,-50%)', top: '50%' }}>
              <Link
                href={`/profile/ngo/select-audience-main?audience=${currentNGO?.organizationUserDto?.joinAudience}`}
                passHref
              >
                <Button
                  variant="outlined"
                  startIcon={<Icon name="Earth" />}
                  endIcon={<Icon name="down-arrow" color="error.main" />}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(
                          currentNGO?.organizationUserDto?.joinAudience as AudienceEnum
                        )
                      ]
                    }
                  </Typography>
                </Button>
              </Link>
            </Box>
          </Box>
        </Stack>

        <Divider />
      </Stack>
    </Dialog>
  );
}
