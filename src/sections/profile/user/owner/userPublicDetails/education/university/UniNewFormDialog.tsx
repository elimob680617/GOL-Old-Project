import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowDown2, ArrowLeft, CloseSquare, Eye } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AudienceEnum, InstituteTypeEnum, PersonCollege } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFCheckbox } from 'src/components/hook-form';
import {
  emptyUniversity,
  userUniversitySelector,
  userUniversityUpdated,
} from 'src/redux/slices/profile/userUniversity-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import { useUpdatePersonCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updatePersonCollege.generated';
import * as Yup from 'yup';
import { useAddPersonCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createPersonCollege.generated';

export default function UniNewFormDialog() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  //Mutations
  const [createPersonUniversity, { isLoading: createIsLoading, data: createRes }] = useAddPersonCollegeMutation();
  const [updateCurrentUniversity, { isLoading: updateIsLoading, data: updateRes }] = useUpdatePersonCollegeMutation();

  //For Redux Tools
  const dispatch = useDispatch();
  const userUniversity = useSelector(userUniversitySelector);
  const isEdit = userUniversity?.id;

  //Functions for Mutation and Redux
  useEffect(() => {
    trigger(['collegeDto', 'startDate']);
  }, []);

  useEffect(() => {
    if (!userUniversity) router.push(PATH_APP.profile.user.publicDetails.root);
  }, [userUniversity, router]);

  const handleNavigation = (url: string) => {
    dispatch(
      userUniversityUpdated({
        ...getValues(),
        isChange: isDirty || userUniversity?.isChange,
        isValid: isValid || userUniversity?.isValid,
      })
    );
    router.push(url);
  };

  const onSubmit = async (data: PersonCollege) => {
    const startDate = new Date(data.startDate).toISOString();
    let endDate;
    if (data.endDate && data.graduated) {
      endDate = new Date(data.endDate).toISOString();
    }

    if (isEdit) {
      const response: any = await updateCurrentUniversity({
        filter: {
          dto: {
            id: data.id,
            audience: userUniversity?.audience || data.audience,
            collegeId: data.collegeDto?.id,
            concentrationId: data.concentrationDto?.id,
            graduated: data.graduated,
            startDate: startDate,
            endDate: endDate,
            instituteType: InstituteTypeEnum.University,
          },
        },
      });
      if (response?.data?.updatePersonCollege?.isSuccess) {
        enqueueSnackbar('The University has been successfully edited ', { variant: 'success' });
        dispatch(emptyUniversity());
        router.push(PATH_APP.profile.user.publicDetails.root);
      } else {
        enqueueSnackbar('The University unfortunately not edited', { variant: 'error' });
      }
    } else {
      const response: any = await createPersonUniversity({
        filter: {
          dto: {
            audience: userUniversity?.audience || data.audience,
            graduated: data.graduated,
            startDate: startDate,
            endDate: endDate,
            collegeId: data.collegeDto?.id,
            concentrationId: data.concentrationDto?.id,
            instituteType: InstituteTypeEnum.University,
          },
        },
      });
      if (response?.data?.addPersonCollege?.isSuccess) {
        enqueueSnackbar('The University has been successfully added ', { variant: 'success' });
        dispatch(emptyUniversity());
        router.push(PATH_APP.profile.user.publicDetails.root);
      } else if (!response?.createCollegeData?.addPersonCollege?.isSuccess) {
        enqueueSnackbar('The University unfortunately not added', { variant: 'error' });
      }
    }
  };
  const handleDiscardDialog = () => {
    if (userUniversity?.isChange || isDirty) {
      handleNavigation(PATH_APP.profile.user.publicDetails.university.discard);
    } else {
      router.push(PATH_APP.profile.user.publicDetails.root);
      dispatch(emptyUniversity());
    }
  };

  //Yup Validation schema & RHF
  const universityValidationSchema = Yup.object().shape({
    collegeDto: Yup.object()
      .shape({
        name: Yup.string().required('Required'),
      })
      .required(),
    startDate: Yup.string().required('Required'),
    graduated: Yup.boolean(),
    endDate: Yup.string()
      .nullable()
      .when('graduated', {
        is: true,
        then: Yup.string().required('Required'),
      }),
  });

  const methods = useForm<PersonCollege>({
    defaultValues: {
      ...userUniversity,
    },
    resolver: yupResolver(universityValidationSchema),
    mode: 'onChange',
  });
  const {
    getValues,
    watch,
    trigger,
    setValue,
    handleSubmit,
    formState: { isValid, isDirty },
  } = methods;
  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleDiscardDialog}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3, minHeight: 320 }}>
          <Stack direction="row" spacing={2} sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
                <ArrowLeft />
              </IconButton>
              <Typography variant="subtitle1" color="text.primary">
                {isEdit ? 'Edit University' : 'Add University'}
              </Typography>
            </Stack>
            <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
              <CloseSquare variant="Outline" color={theme.palette.text.primary} />
            </IconButton>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              University Name*
            </Typography>
            <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.university.universityName)}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ cursor: 'pointer' }}>
                {watch('collegeDto') ? (
                  <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                    {watch('collegeDto')?.name}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                    University Name
                  </Typography>
                )}
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Concenteration
            </Typography>
            {watch('concentrationDto') ? (
              <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                {watch('concentrationDto')?.title}
                <IconButton
                  onClick={() => {
                    setValue('concentrationDto', undefined, { shouldDirty: true });
                    dispatch(userUniversityUpdated({ ...getValues(), isChange: true, concentrationDto: undefined }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.university.concentrationName)}>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  Concenteration
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack direction="row" sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color={theme.palette.text.primary}>
              Graduated
            </Typography>
            <RHFCheckbox
              label=""
              name="graduated"
              sx={{
                color: 'primary.main',
                '&.Mui-checked': {
                  color: 'primary.main',
                },
              }}
            />
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Start Date*
            </Typography>
            {watch('startDate') ? (
              <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                {getMonthName(new Date(watch('startDate')))}, {new Date(watch('startDate')).getFullYear()}
                <IconButton
                  onClick={() => {
                    setValue('startDate', undefined, { shouldValidate: true, shouldDirty: true });
                    dispatch(userUniversityUpdated({ ...getValues() }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.university.startDate)}>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  Start Date
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              End Date{watch('graduated') && '*'}
            </Typography>
            {watch('endDate') && watch('graduated') ? (
              <Typography
                variant="body2"
                color={watch('graduated') ? theme.palette.text.primary : theme.palette.text.secondary}
                sx={{ cursor: watch('graduated') ? 'pointer' : 'default' }}
              >
                {watch('graduated')
                  ? `${getMonthName(new Date(watch('endDate')))}, ${new Date(watch('endDate')).getFullYear()}`
                  : 'present'}
                <IconButton
                  onClick={() => {
                    setValue('endDate', undefined, { shouldValidate: true, shouldDirty: true });
                    dispatch(userUniversityUpdated({ ...getValues() }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box
                onClick={() =>
                  watch('graduated') && handleNavigation(PATH_APP.profile.user.publicDetails.university.endDate)
                }
              >
                <Typography
                  variant="body2"
                  color={theme.palette.text.secondary}
                  sx={{ cursor: watch('graduated') ? 'pointer' : 'default' }}
                >
                  {watch('graduated') ? 'End Date' : 'Present'}
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
            <Stack direction="row" spacing={1}>
              {isEdit && (
                <Button
                  variant="text"
                  color="error"
                  onClick={() => router.push(PATH_APP.profile.user.publicDetails.university.delete)}
                >
                  <Typography variant="button">Delete</Typography>
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                onClick={() => {
                  dispatch(userUniversityUpdated(getValues()));
                  router.push(PATH_APP.profile.user.publicDetails.university.audience);
                }}
                endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              >
                <Typography color={theme.palette.text.primary}>
                  {
                    Object.keys(AudienceEnum)[
                      Object.values(AudienceEnum).indexOf(userUniversity?.audience as AudienceEnum)
                    ]
                  }
                </Typography>
              </Button>
            </Stack>
            <LoadingButton
              variant="contained"
              disabled={!isValid || !(isDirty || userUniversity?.isChange)}
              color="primary"
              type="submit"
              loading={createIsLoading || updateIsLoading}
            >
              {isEdit ? 'Save' : 'Add'}
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}
