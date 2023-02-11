import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowDown2, ArrowLeft, CloseSquare, Eye } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AudienceEnum, PersonSchool } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import { schoolWasEmpty, userSchoolsSelector, userSchoolUpdated } from 'src/redux/slices/profile/userSchool-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useAddPersonSchoolMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createPersonSchool.generated';
import { useUpdatePersonSchoolMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updatePersonSchool.generated';
import * as Yup from 'yup';

export default function SchoolNewFormDialog() {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  //Mutation
  const [createPersonSchool, { isLoading: createIsLoading, data: userSchool }] = useAddPersonSchoolMutation();
  const [updateCurrentSchool, { isLoading: updateIsLoading, data: editUserSchool }] = useUpdatePersonSchoolMutation();

  //For Redux Tools
  const dispatch = useDispatch();
  const userHighSchool = useSelector(userSchoolsSelector);
  const isEdit = !!userHighSchool?.id;

  //Functions for Mutation and Redux
  const handleNavigation = (url: string) => {
    dispatch(userSchoolUpdated({ ...getValues(), isValid: isValid || userHighSchool?.isValid }));
    router.push(url);
  };

  const onSubmit = async (data: PersonSchool) => {
    if (isEdit) {
      //update mutation func
      const response: any = await updateCurrentSchool({
        filter: {
          dto: {
            id: data.id,
            year: data?.year ? +data?.year : undefined,
            schoolId: data.school?.id,
            audience: data.audience || userHighSchool?.audience,
          },
        },
      });
      if (response?.data?.updatePersonSchool?.isSuccess) {
        enqueueSnackbar('The High school has been successfully edited ', { variant: 'success' });
        dispatch(schoolWasEmpty());
        router.push(PATH_APP.profile.user.publicDetails.root);
      } else {
        enqueueSnackbar('The High school unfortunately not edited', { variant: 'error' });
      }
    } else {
      //add mutation func
      const response: any = await createPersonSchool({
        filter: {
          dto: {
            // id: null,
            year: data?.year ? +data?.year : undefined,
            schoolId: data.school?.id,
            audience: data.audience || userHighSchool?.audience,
          },
        },
      });
      if (response?.data?.addPersonSchool?.isSuccess) {
        enqueueSnackbar('The High school has been successfully added ', { variant: 'success' });
        dispatch(schoolWasEmpty());
        router.push(PATH_APP.profile.user.publicDetails.root);
      } else {
        enqueueSnackbar('The High school unfortunately not added', { variant: 'error' });
      }
    }
  };
  useEffect(() => {
    trigger(['school.title']);
  }, []);

  useEffect(() => {
    if (!userHighSchool) router.push(PATH_APP.profile.user.publicDetails.root);
  }, [userHighSchool, router]);

  const handleDiscardDialog = () => {
    if (userHighSchool?.isChange || isDirty) {
      handleNavigation(PATH_APP.profile.user.publicDetails.school.discard);
    } else {
      dispatch(schoolWasEmpty());
      router.push(PATH_APP.profile.user.publicDetails.root);
    }
  };

  //Yup Validation schema & RHF
  const SchoolValidationSchema = Yup.object().shape({
    school: Yup.object().shape({
      title: Yup.string().required('Required'),
    }),
  });

  const methods = useForm<PersonSchool>({
    mode: 'onChange',
    defaultValues: {
      ...userHighSchool,
    },
    resolver: yupResolver(SchoolValidationSchema),
  });

  const {
    trigger,
    getValues,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid, isDirty },
  } = methods;

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleDiscardDialog}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3, minHeight: 320, minWidth: 600 }}>
          <Stack direction="row" spacing={2} sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2}>
              <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
                <ArrowLeft />
              </IconButton>
              <Typography variant="subtitle1" color="text.primary">
                {isEdit ? 'Edit High School' : 'Add High School'}
              </Typography>
            </Stack>
            <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
              <CloseSquare variant="Outline" color={theme.palette.text.primary} />
            </IconButton>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              School Name*
            </Typography>
            <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.school.schoolName)}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ cursor: 'pointer' }}>
                {watch('school') ? (
                  <Typography variant="body2" color="text.primary">
                    {watch('school.title')}
                    {/* {watch('school')?.title} */}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    School Name
                  </Typography>
                )}
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Class Year
            </Typography>

            {watch('year') ? (
              <Typography color="text.primary" variant="body2" sx={{ cursor: 'pointer' }}>
                {watch('year')}
                <IconButton
                  onClick={() => {
                    setValue('year', undefined, { shouldDirty: true });
                    dispatch(userSchoolUpdated({ ...getValues() }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.school.year)}>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  Class Year
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
                  onClick={() => router.push(PATH_APP.profile.user.publicDetails.school.delete)}
                >
                  <Typography variant="button">Delete</Typography>
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                onClick={() => {
                  dispatch(userSchoolUpdated(getValues()));
                  router.push(PATH_APP.profile.user.publicDetails.school.audience);
                }}
                endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              >
                <Typography color={theme.palette.text.primary}>
                  {
                    Object.keys(AudienceEnum)[
                      Object.values(AudienceEnum).indexOf(userHighSchool?.audience as AudienceEnum)
                    ]
                  }
                </Typography>
              </Button>
            </Stack>
            <LoadingButton
              loading={createIsLoading || updateIsLoading}
              variant="contained"
              color="primary"
              disabled={!isValid || !(isDirty || userHighSchool?.isChange)}
              type="submit"
            >
              {isEdit ? 'Save' : 'Add'}
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}
