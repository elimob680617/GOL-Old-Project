// @mui
import { Box, Dialog, IconButton, Stack, Typography } from '@mui/material';
// components
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Company } from 'src/@types/sections/serverTypes';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { experienceAdded, userExperienceSelector } from 'src/redux/slices/profile/userExperiences-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import debounceFn from 'src/utils/debounce';
import { useCreateCompanyMutation } from 'src/_requests/graphql/profile/experiences/mutations/createCompany.generated';
import { useLazySearchCompaniesQuery } from 'src/_requests/graphql/profile/experiences/queries/searchCompanies.generated';

function ExperienceCompanyDialog() {
  const [searchCompany, { data, isFetching }] = useLazySearchCompaniesQuery();
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const experienceData = useSelector(userExperienceSelector);

  useEffect(() => {
    if (!experienceData) router.push('/profile/experience-list');
  }, [experienceData, router]);

  const [createCompany] = useCreateCompanyMutation();

  const handleInputChange = (val: string) => {
    setIsTyping(!!val.length);
    if (val.length > 2)
      debounceFn(() =>
        searchCompany({
          filter: {
            dto: {
              title: val,
            },
          },
        })
      );
  };

  const handleChange = (val: Company & { inputValue?: string }) => {
    if (val?.inputValue) {
      //addable
      createCompany({
        filter: {
          dto: {
            title: val.inputValue,
          },
        },
      }).then((res: any) => {
        if (res?.data?.createCompany?.isSuccess) {
          const data = res?.data?.createCompany?.listDto?.items?.[0];
          dispatch(
            experienceAdded({
              companyDto: {
                id: data.id,
                title: data.title,
              },
              isChange: true,
            })
          );

          router.back();
        }
      });
    } else {
      dispatch(
        experienceAdded({
          companyDto: val,
          isChange: true,
        })
      );
      router.back();
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ px: 2, py: 3, minHeight: 320 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="subtitle2" color="text.primary">
            Company Name
          </Typography>
        </Stack>

        <AutoCompleteAddable
          autoFocus
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
          options={isTyping ? data?.searchCompanies?.listDto?.items || [] : []}
          placeholder="Search"
        />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 7 }}>
            {!isTyping && (
              <Typography color="text.secondary" variant="body2">
                Start typing to find your Company Name
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Dialog>
  );
}

export default ExperienceCompanyDialog;
