import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import { ArrowDown2, ArrowLeft, Camera, CloseSquare, Eye } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AudienceEnum, EmploymentTypeEnum, Experience } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import {
  emptyExperience,
  experienceAdded,
  userExperienceSelector,
} from 'src/redux/slices/profile/userExperiences-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import { useAddExperienceMutation } from 'src/_requests/graphql/profile/experiences/mutations/addExperience.generated';
import { useUpdateExperienceMutation } from 'src/_requests/graphql/profile/experiences/mutations/updateExperience.generated';
import * as Yup from 'yup';

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '46%',
  transform: 'translate(0, -50%)',
  zIndex: 1,
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

function ExperienceNewDialog() {
  const router = useRouter();
  const experienceData = useSelector(userExperienceSelector);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [addExperienceMutate, { isLoading: addLoading }] = useAddExperienceMutation();
  const [updateExperienceMutate, { isLoading: updateLoading }] = useUpdateExperienceMutation();

  useEffect(() => {
    if (!experienceData) router.push(PATH_APP.profile.user.experience.root);
  }, [experienceData, router]);

  const ExperienceFormSchema = Yup.object().shape({
    title: Yup.string().required(''),
    companyDto: Yup.object().shape({
      title: Yup.string().required(''),
    }),
    employmentType: Yup.string().required(''),
    startDate: Yup.string().required(''),
    stillWorkingThere: Yup.boolean(),
    endDate: Yup.string()
      .nullable()
      .when('stillWorkingThere', {
        is: false,
        then: Yup.string().required('Required'),
      }),
  });
  const dispatch = useDispatch();

  const methods = useForm<Experience & { titleView?: boolean; descView?: boolean }>({
    resolver: yupResolver(ExperienceFormSchema),
    defaultValues: { ...experienceData, titleView: true, descView: true },
    mode: 'onChange',
  });
  const {
    handleSubmit,
    watch,
    trigger,
    getValues,
    setValue,
    formState: { isValid, isDirty },
  } = methods;

  useEffect(() => {
    trigger(['companyDto.title', 'title', 'employmentType', 'startDate', 'endDate', 'stillWorkingThere']);
  }, [trigger]);

  const onSubmit = async (data: Experience) => {
    const startDate = new Date(data.startDate);
    let endDate;
    if (data.stillWorkingThere) endDate = undefined;
    else if (data.endDate) {
      const date = new Date(data.endDate);
      endDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-01';
    }

    if (data.id) {
      const res: any = await updateExperienceMutate({
        filter: {
          dto: {
            id: data.id,
            audience: data.audience,
            employmentType: data.employmentType,
            description: data.description,
            mediaUrl: data.mediaUrl,
            stillWorkingThere: data.stillWorkingThere,
            title: data.title,
            cityId: data.cityDto?.id,
            companyId: data.companyDto?.id,
            startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
            endDate: endDate,
          },
        },
      });
      if (res?.data?.updateExperience?.isSuccess) {
        enqueueSnackbar('update successfully', { variant: 'success' });
        router.push(PATH_APP.profile.user.experience.root);
        dispatch(emptyExperience());
      }
    } else {
      const res: any = await addExperienceMutate({
        filter: {
          dto: {
            audience: data.audience,
            employmentType: data.employmentType,
            description: data.description,
            mediaUrl: data.mediaUrl,
            stillWorkingThere: data.stillWorkingThere,
            title: data.title,
            cityId: data.cityDto?.id,
            companyId: data.companyDto?.id,
            startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
            endDate: endDate,
          },
        },
      });

      if (res?.data?.addExperience?.isSuccess) {
        enqueueSnackbar('Experience successfully', { variant: 'success' });
        dispatch(emptyExperience());
        router.push(PATH_APP.profile.user.experience.root);
      }
    }
  };

  const handleNavigation = (url: string) => {
    dispatch(experienceAdded({ ...getValues(), isChange: isDirty || experienceData?.isChange }));
    router.push(url);
  };

  const handleClose = () => {
    if (isDirty || experienceData?.isChange) {
      dispatch(
        experienceAdded({
          ...getValues(),
          isChange: isDirty || experienceData?.isChange,
          isValid: isValid || experienceData?.isValid,
        })
      );
      router.push(PATH_APP.profile.user.experience.discard);
    } else {
      router.back();
      dispatch(emptyExperience());
    }
  };

  // const handleBack = () => {
  //   dispatch(emptyExperience());
  //   router.back();
  // };

  return (
    <Dialog open={true} fullWidth={true} onClose={handleClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
            <Stack direction="row" spacing={2}>
              <IconButton sx={{ p: 0 }} onClick={handleClose}>
                <ArrowLeft />
              </IconButton>
              <Typography variant="subtitle2" color="text.primary">
                {experienceData?.id ? 'Edit Experience' : 'Add Experience'}
              </Typography>
            </Stack>
            <IconButton onClick={handleClose}>
              <CloseSquare />
            </IconButton>
          </Stack>
          <Divider sx={{ height: 2 }} />

          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Title*
            </Typography>
            {watch('titleView') ? (
              <Typography
                variant="body2"
                color={watch('title') ? 'text.primary' : 'text.secondary'}
                onClick={() => setValue('titleView', false)}
              >
                {watch('title') || 'Ex: Sales Manager'}
              </Typography>
            ) : (
              <Box>
                <RHFTextField
                  placeholder="Ex: Sales Manager"
                  name="title"
                  size="small"
                  error={false}
                  inputProps={{ maxLength: 60 }}
                  onBlur={() => setValue('titleView', true)}
                  autoFocus
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                  sx={{ width: '100%', textAlign: 'right' }}
                >
                  {watch('title')?.length || 0}/60
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Employment Type*
            </Typography>
            <Box
              sx={{ cursor: 'pointer' }}
              onClick={() => handleNavigation(PATH_APP.profile.user.experience.employmentType)}
            >
              {watch('employmentType') ? (
                <Typography variant="body2" color="text.primary">
                  {Object.keys(EmploymentTypeEnum)
                    [Object.values(EmploymentTypeEnum).indexOf(watch('employmentType') as EmploymentTypeEnum)].replace(
                      /([A-Z])/g,
                      ' $1'
                    )
                    .trim()}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Ex: Full Time
                </Typography>
              )}
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Company name*
            </Typography>
            <Box sx={{ cursor: 'pointer' }} onClick={() => handleNavigation(PATH_APP.profile.user.experience.company)}>
              {watch('companyDto') ? (
                <Typography variant="body2" color="text.primary">
                  {watch('companyDto.title')}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  EX: Software Genesis Group
                </Typography>
              )}
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Location
            </Typography>
            {watch('cityDto') ? (
              <Typography variant="body2" color="text.primary">
                {watch('cityDto.name')}
                <IconButton
                  onClick={() => {
                    setValue('cityDto', undefined, { shouldDirty: true });
                    dispatch(experienceAdded({ ...getValues(), cityDto: undefined, isChange: true }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box
                sx={{ cursor: 'pointer' }}
                onClick={() => handleNavigation(PATH_APP.profile.user.experience.location)}
              >
                <Typography variant="body2" color="text.secondary">
                  Ex: England, London
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="body2" color="text.primary">
              <RHFCheckbox
                name="stillWorkingThere"
                label="I am currently work in this role"
                sx={{
                  height: 0,
                }}
              />
            </Typography>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Start Date*
            </Typography>
            {watch('startDate') ? (
              <Typography variant="body2" color="text.primary">
                {getMonthName(new Date(watch('startDate')))}, {new Date(watch('startDate')).getFullYear()}
                <IconButton
                  onClick={() => {
                    setValue('startDate', undefined, { shouldValidate: true, shouldDirty: true });
                    dispatch(experienceAdded({ ...getValues() }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box
                sx={{ cursor: 'pointer' }}
                onClick={() => handleNavigation(PATH_APP.profile.user.experience.startDate)}
              >
                <Typography variant="body2" color="text.secondary">
                  Start Date
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              End Date{!watch('stillWorkingThere') && '*'}
            </Typography>
            {watch('endDate') && !watch('stillWorkingThere') ? (
              <Typography variant="body2" color="text.primary">
                {getMonthName(new Date(watch('endDate')))}, {new Date(watch('endDate')).getFullYear()}
                <IconButton
                  onClick={() => {
                    setValue('endDate', undefined, { shouldValidate: true, shouldDirty: true });
                    dispatch(experienceAdded({ ...getValues() }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box
                sx={{ cursor: !watch('stillWorkingThere') ? 'pointer' : 'default' }}
                onClick={() =>
                  watch('stillWorkingThere') ? undefined : handleNavigation(PATH_APP.profile.user.experience.endDate)
                }
              >
                <Typography variant="body2" color="text.secondary">
                  {watch('stillWorkingThere') ? 'Present' : 'End Date'}
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Description
            </Typography>
            {watch('descView') ? (
              <Typography
                variant="body2"
                color={watch('description') ? 'text.primary' : 'text.secondary'}
                onClick={() => setValue('descView', false)}
              >
                {watch('description') || 'Add Detail and Description about your Experience.'}
              </Typography>
            ) : (
              <Box>
                <RHFTextField
                  size="small"
                  multiline
                  name="description"
                  placeholder="Add Detail and Description about your Experience."
                  inputProps={{ maxLength: 500 }}
                  onBlur={() => setValue('descView', true)}
                  autoFocus
                  maxRows={4}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                  sx={{ width: '100%', textAlign: 'right' }}
                >
                  {watch('description')?.length || 0}/500
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Photo
            </Typography>
            <Stack>
              {!watch('mediaUrl') ? (
                <Stack direction="row" justifyContent={'space-between'}>
                  <Typography variant="body2" color="text.primary">
                    Add photos.
                  </Typography>
                  <Typography
                    variant="overline"
                    color="primary.main"
                    sx={{ cursor: 'pointer', textTransform: 'none' }}
                    component="div"
                    onClick={() => handleNavigation(PATH_APP.profile.user.experience.photo)}
                  >
                    + Add Photo
                  </Typography>
                </Stack>
              ) : (
                <Box display="flex" justifyContent="center" position="relative">
                  <IconButtonStyle onClick={() => router.push(PATH_APP.profile.user.experience.editPhoto)}>
                    <Camera size="24" color={theme.palette.text.secondary} />
                  </IconButtonStyle>
                  <Box>
                    <Image
                      onClick={() => handleNavigation(PATH_APP.profile.user.experience.photo)}
                      src={watch('mediaUrl') as string}
                      width={328}
                      height={184}
                      alt="experience-photo"
                    />
                  </Box>
                </Box>
              )}
            </Stack>
          </Stack>

          <Divider />
          <Stack sx={{ px: 2 }} direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={0.5}>
              {experienceData?.id && (
                <Link href={PATH_APP.profile.user.experience.delete} passHref>
                  <Button color="error" variant="text" sx={{ width: 105 }}>
                    Delete
                  </Button>
                </Link>
              )}
              <Button
                variant="outlined"
                startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                onClick={() => {
                  dispatch(experienceAdded(getValues()));
                  router.push(PATH_APP.profile.user.experience.audience);
                }}
                endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              >
                <Typography color={theme.palette.text.primary}>
                  {
                    Object.keys(AudienceEnum)[
                      Object.values(AudienceEnum).indexOf(experienceData?.audience as AudienceEnum)
                    ]
                  }
                </Typography>
              </Button>
            </Stack>
            <LoadingButton
              loading={addLoading || updateLoading}
              type="submit"
              variant="contained"
              disabled={!isValid || !(isDirty || experienceData?.isChange)}
              color="primary"
            >
              {experienceData?.id ? 'Save' : 'Add'}
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}

export default ExperienceNewDialog;
