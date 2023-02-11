import { Box, Dialog, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GroupCategoryTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { Loading } from 'src/components/loading';
import { ngoCategoryUpdated } from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import debounceFn from 'src/utils/debounce';
import { useLazySearchGroupCategoriesQuery } from 'src/_requests/graphql/profile/ngoPublicDetails/queries/searchGroupCategories.generated';

function CategoryTypeDialog() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [searchCategories, { data, isFetching }] = useLazySearchGroupCategoriesQuery();

  const handleInputChange = (value: string) => {
    debounceFn(() =>
      searchCategories({
        filter: {
          dto: {
            title: value,
            groupCategoryType: GroupCategoryTypeEnum.Category,
          },
        },
      })
    );
  };

  const handleChange = (value: any & { inputValue?: string }) => {
    dispatch(
      ngoCategoryUpdated({
        id: value.id,
        title: value.title,
        iconUrl: value.iconUrl,
        isChange: true,
      })
    );
    router.back();
  };

  useEffect(() => {
    searchCategories({
      filter: {
        dto: {
          title: '',
          groupCategoryType: GroupCategoryTypeEnum.Category,
        },
      },
    });
  }, [searchCategories]);

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ minHeight: 320, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              NGO Category
            </Typography>
          </Box>
          <Link href={PATH_APP.profile.ngo.publicDetails.ngoCategory.root} passHref>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} px={2}>
          <TextField
            size="small"
            onChange={(e) => {
              handleInputChange((e.target as HTMLInputElement).value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ marginRight: 1 }}>
                    <Icon name="Research" type="solid" size={20} />
                  </Box>
                </InputAdornment>
              ),
            }}
            variant="outlined"
            placeholder="NGO Category"
          />
          <Box>
            {isFetching ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loading />
              </Box>
            ) : (
              <>
                {data?.searchGroupCategories?.listDto?.items?.map((_category) => (
                  <Stack key={_category?.id} direction="row" spacing={1} mb={2}>
                    <img
                      src={_category?.iconUrl || undefined}
                      width={24}
                      height={24}
                      alt=""
                      style={{ marginRight: 8 }}
                    />
                    <Typography onClick={() => handleChange(_category)} sx={{ cursor: 'pointer' }}>
                      {_category?.title}
                    </Typography>
                  </Stack>
                ))}
              </>
            )}
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default CategoryTypeDialog;
