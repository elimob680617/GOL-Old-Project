import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import debounceFn from 'src/utils/debounce';
import { LocationTypeEnum, OrgUserFieldEnum, RestrictionTypeEnum, UserTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { registerLocationSelector, registerLocationUpdated } from 'src/redux/slices/afterRegistration';
import { useDispatch, useSelector } from 'src/redux/store';
import { useLazySearchCitiesQuery } from 'src/_requests/graphql/locality/queries/searchCities.generated';
import { useLazySearchPlacesQuery } from 'src/_requests/graphql/locality/queries/searchPlaces.generated';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { useUpsertLocationMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/addCurrentCity.generated';
import TitleAndProgress from './TitleAndProgress';
import DialogIconButtons from './DialogIconButtons';

export default function SelectLocation() {
  const { user } = useAuth();
  const router = useRouter();

  const dispatch = useDispatch();
  const locationSelector = useSelector(registerLocationSelector);

  const [step, setStep] = React.useState<number>();
  const [showDialog, setShowDialog] = React.useState<boolean>(true);
  const [searchPlaces, { data: placesData, isFetching: placesIsFetching }] = useLazySearchPlacesQuery();
  const [searchCities, { data, isFetching }] = useLazySearchCitiesQuery();
  const [upsertLocation, { isLoading }] = useUpsertLocationMutation();
  const [upsertPlaceNgoUser, { isLoading: isPlaceLoading }] = useUpdateOrganizationUserFieldMutation();

  useLayoutEffect(() => {
    if (router.query.index?.[0] === 'location' && user?.completeQar) {
      setShowDialog(false);
      router.push(PATH_APP.home.index);
    }
  }, []);

  const cityOptions = useMemo(
    () => data?.searchCities?.listDto?.items?.map((item) => ({ id: item?.id, title: item?.name })),
    [data?.searchCities.listDto?.items]
  );
  const placeOptions = useMemo(
    () =>
      placesData?.searchPlaces?.listDto?.items?.[0]?.predictions?.map((item) => ({
        id: item?.placeId,
        title: item?.description,
      })),
    [placesData?.searchPlaces?.listDto?.items]
  );

  useEffect(() => {
    if (user?.userType === UserTypeEnum.Normal) {
      setStep(2);
    } else if (user?.userType === UserTypeEnum.Ngo) {
      setStep(1);
    }
  }, [router]);

  const handleInputChange = (value: string) => {
    if (value.length > 2)
      if (user?.userType === UserTypeEnum.Normal) {
        debounceFn(() =>
          searchCities({
            filter: {
              dto: {
                seearchValue: value,
              },
            },
          })
        );
      } else if (user?.userType === UserTypeEnum.Ngo) {
        debounceFn(() =>
          searchPlaces({
            filter: {
              dto: {
                searchText: value,
                restrictionType: RestrictionTypeEnum.None,
              },
            },
          })
        );
      }
  };

  const handleChange = (value) => {
    dispatch(registerLocationUpdated({ id: value?.id, title: value?.title }));
  };

  const handleSubmitLocation = async () => {
    if (user?.userType === UserTypeEnum.Normal) {
      const res: any = await upsertLocation({
        filter: {
          dto: {
            locationType: LocationTypeEnum.CurrnetCity,
            cityId: locationSelector?.id,
            id: locationSelector?.id,
          },
        },
      });
      if (res?.data?.upsertLocation?.isSuccess) {
        handleRouting();
        // dispatch(registerLocationUpdated(undefined));
      }
    } else if (user?.userType === UserTypeEnum.Ngo) {
      const response: any = await upsertPlaceNgoUser({
        filter: {
          dto: {
            field: OrgUserFieldEnum.Place,
            googlePlaceId: locationSelector?.id,
          },
        },
      });
      if (response?.data?.updateOrganizationUserField?.isSuccess) {
        handleRouting();
        // dispatch(registerLocationUpdated(undefined));
      }
    }
  };

  const handleRouting = () => {
    if (user?.userType === UserTypeEnum.Normal) {
      router.push(PATH_APP.home.afterRegister.category);
    } else if (user?.userType === UserTypeEnum.Ngo) {
      router.push(PATH_APP.home.afterRegister.field);
    }
  };

  return (
    <Dialog fullWidth={true} open={showDialog}>
      <DialogTitle>
        <DialogIconButtons router={router} user={user} hasBackIcon />
        <Stack alignItems="center" mt={-5}>
          <TitleAndProgress step={step} userType={user?.userType} />
        </Stack>
        <Stack alignItems="center" justifyContent="center" mb={3}>
          <Typography variant="h6" color="text.primary">
            Where are you located?
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack alignItems="center" justifyContent="center" mb={3}>
          <Box sx={{ width: 388, height: 48 }}>
            <Autocomplete
              fullWidth
              autoComplete
              value={locationSelector as any}
              disableClearable
              freeSolo
              loading={isFetching || placesIsFetching}
              options={cityOptions || placeOptions || []}
              getOptionLabel={(option) => option?.title as string}
              onInputChange={(event, value) => {
                handleInputChange(value);
              }}
              onChange={(ev, val) => handleChange(val)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px !important' } }}
                  placeholder="Search ..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <Box sx={{ marginRight: 2, marginLeft: 3 }}>
                          <Icon name="Research" type="solid" color="grey.500" />
                          {params.InputProps.startAdornment}
                        </Box>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mx={3}>
          <Button variant="outlined" sx={{ borderColor: 'grey.300' }} onClick={handleRouting}>
            <Typography color="grey.900">Skip</Typography>
          </Button>

          <LoadingButton
            loading={isLoading || isPlaceLoading}
            variant="contained"
            color="primary"
            endIcon={<Icon name="right-arrow-1" color="common.white" />}
            disabled={!locationSelector?.id}
            onClick={handleSubmitLocation}
          >
            <Typography>Next</Typography>
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
