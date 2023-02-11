import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowDown2, ArrowLeft, CloseSquare, Eye } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AudienceEnum, FeatureAudienceEnum, InstituteTypeEnum, PersonCollege } from 'src/@types/sections/serverTypes';
import { Audience } from 'src/components/audience';
import { FormProvider, RHFCheckbox } from 'src/components/hook-form';
import { emptyCollege, userCollegesSelector, userCollegeUpdated } from 'src/redux/slices/profile/userColloges-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import { useAddPersonCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createPersonCollege.generated';
import { useUpdatePersonCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updatePersonCollege.generated';
import * as Yup from 'yup';

export default function CollegeNewFormDialog() {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [openAudience, setOpenAudience] = React.useState<boolean>(false);

  const [createPersonCollege, { isLoading: addIsLoading }] = useAddPersonCollegeMutation();
  const [updateCurrentCollege, { isLoading: updateIsLoading }] = useUpdatePersonCollegeMutation();

  const dispatch = useDispatch();
  const userColleges = useSelector(userCollegesSelector);

  const isEdit = !!userColleges?.id;
  const handleNavigation = (url: string) => {
    dispatch(
      userCollegeUpdated({
        ...getValues(),
        isChange: isDirty || userColleges?.isChange,
        isValid: isValid || userColleges?.isValid,
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
      const response: any = await updateCurrentCollege({
        filter: {
          dto: {
            id: data.id,
            collegeId: data.collegeDto?.id,
            concentrationId: data.concentrationDto?.id,
            graduated: data.graduated,
            audience: userColleges?.audience || data.audience,
            startDate: startDate, //(data?.startDate as Date).toISOString(), //startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
            endDate: endDate,
            instituteType: InstituteTypeEnum.College,
          },
        },
      });
      if (response?.data?.updatePersonCollege?.isSuccess) {
        enqueueSnackbar('The College has been successfully edited ', { variant: 'success' });
        dispatch(emptyCollege());
        router.push(PATH_APP.profile.user.publicDetails.root);
      } else {
        enqueueSnackbar('The College unfortunately not edited', { variant: 'error' });
      }
    } else {
      const response: any = await createPersonCollege({
        filter: {
          dto: {
            audience: userColleges?.audience || data.audience,
            graduated: data.graduated,
            startDate: startDate,
            endDate: endDate,
            collegeId: data.collegeDto?.id,
            concentrationId: data.concentrationDto?.id,
            instituteType: InstituteTypeEnum.College,
          },
        },
      });
      if (response?.data?.addPersonCollege?.isSuccess) {
        enqueueSnackbar('The College has been successfully added ', { variant: 'success' });
        dispatch(emptyCollege());
        router.push(PATH_APP.profile.user.publicDetails.root);
      } else if (!response?.createCollegeData?.addPersonCollege?.isSuccess) {
        enqueueSnackbar('The College unfortunately not added', { variant: 'error' });
      }
    }
  };
  useEffect(() => {
    trigger(['collegeDto', 'startDate']);
  }, []);

  useEffect(() => {
    if (!userColleges) router.push(PATH_APP.profile.user.publicDetails.root);
  }, [userColleges, router]);
  //  !getValues().id
  const handleDiscardDialog = () => {
    if (userColleges?.isChange || isDirty) {
      // dispatch(userCollegeUpdated({ isValid: isValid || userColleges?.isValid }));
      handleNavigation(PATH_APP.profile.user.publicDetails.college.discard);
    } else {
      router.push(PATH_APP.profile.user.publicDetails.root);
      dispatch(emptyCollege());
    }
  };

  //Yup Validation schema & RHF
  const CollegeValidationSchema = Yup.object().shape({
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
    mode: 'onChange',
    defaultValues: {
      ...userColleges,
    },
    resolver: yupResolver(CollegeValidationSchema),
  });

  const {
    getValues,
    watch,
    handleSubmit,
    trigger,
    setValue,
    formState: { isValid, isDirty },
  } = methods;
  return (
    <>
      <Dialog fullWidth={true} open={true && !openAudience} keepMounted onClose={handleDiscardDialog}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 3, minHeight: 320 }}>
            <Stack direction="row" spacing={2} sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2}>
                <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
                  <ArrowLeft />
                </IconButton>
                <Typography variant="subtitle1" color="text.primary">
                  {isEdit ? 'Edit College' : 'Add College'}
                </Typography>
              </Stack>
              <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
                <CloseSquare variant="Outline" color={theme.palette.text.primary} />
              </IconButton>
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                College Name*
              </Typography>
              <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.college.collegeName)}>
                {watch('collegeDto') ? (
                  <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                    {watch('collegeDto')?.name}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                    College Name
                  </Typography>
                )}
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
                      dispatch(userCollegeUpdated({ ...userColleges, isChange: true, concentrationDto: undefined }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.college.concentrationName)}>
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
                      // setValue('endDate', undefined,{shouldValidate:true, shouldDirty:true});
                      dispatch(userCollegeUpdated({ ...getValues() }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.college.startDate)}>
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
                      dispatch(userCollegeUpdated({ ...getValues() }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box
                  onClick={() =>
                    watch('graduated') && handleNavigation(PATH_APP.profile.user.publicDetails.college.endDate)
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
                    onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.college.delete)}
                  >
                    <Typography variant="button">Delete</Typography>
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                  onClick={() => {
                    dispatch(userCollegeUpdated(getValues()));
                    setOpenAudience(true);
                    // router.push(PATH_APP.profile.user.publicDetails.college.audience);
                  }}
                  endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
                >
                  <Typography color={theme.palette.text.primary}>
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(userColleges?.audience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
              </Stack>
              <LoadingButton
                loading={addIsLoading || updateIsLoading}
                variant="contained"
                color="primary"
                disabled={!isValid || !(isDirty || userColleges?.isChange)}
                type="submit"
              >
                {isEdit ? 'Save' : 'Add'}
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </Dialog>
      {openAudience && (
        <Audience
          open={openAudience}
          onClose={setOpenAudience}
          feature={FeatureAudienceEnum.College}
          value={userColleges?.audience as AudienceEnum}
          onChange={(val) => {
            dispatch(userCollegeUpdated({ audience: val, isChange: true }));
          }}
        />
      )}
    </>
  );
}
