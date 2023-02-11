import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { Loading } from 'src/components/loading';
// hooks
import { useRouter } from 'next/router';
import React, { useLayoutEffect } from 'react';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
// srvices
import { GroupCategoryTypeEnum, UserTypeEnum } from 'src/@types/sections/serverTypes';
import { useLazySearchGroupCategoriesQuery } from 'src/_requests/graphql/profile/ngoPublicDetails/queries/searchGroupCategories.generated';
// redux
import { Icon } from 'src/components/Icon';
import {
  registerIntrestedCategoriesSelector,
  registerIntrestedCategoriesUpdated,
} from 'src/redux/slices/afterRegistration';
import { useDispatch, useSelector } from 'src/redux/store';
import { useUpsertInterestedCategoriesMutation } from 'src/_requests/graphql/profile/intrestedCategories/mutation/upsertIntrestedCategories.generated';
import TitleAndProgress from '../common/TitleAndProgress';
import DialogIconButtons from '../common/DialogIconButtons';

const CheckBoxStyle = styled(FormControlLabel)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginInline: theme.spacing(0),
  marginRight: theme.spacing(4),
  padding: 0,
}));
const CheckBoxGroupStyle = styled(FormGroup)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  overflowY: 'hidden',
  '&::-webkit-scrollbar': {
    width: 12,
  },

  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[0],
    borderRadius: 8,
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 10,
    border: `4px solid ${theme.palette.grey[0]}`,
  },
}));

export default function SelectCategory() {
  const { user } = useAuth();
  const router = useRouter();
  const [viewMore, setViewMore] = React.useState<boolean>(false);
  const [showDialog, setShowDialog] = React.useState<boolean>(true);
  const dispatch = useDispatch();
  const categoriesSelector = useSelector(registerIntrestedCategoriesSelector);

  const [searchCategories, { data, isFetching }] = useLazySearchGroupCategoriesQuery();
  const [upsertIntrestedCategories, { isLoading }] = useUpsertInterestedCategoriesMutation();

  useLayoutEffect(() => {
    if (router.query.index?.[0] === 'categories' && user?.completeQar) {
      setShowDialog(false);
      router.push(PATH_APP.home.index);
    }
    if (user?.userType !== UserTypeEnum.Normal) {
      router.push(PATH_APP.home.afterRegister.welcome);
    } else {
      searchCategories({
        filter: {
          dto: {
            title: '',
            groupCategoryType: GroupCategoryTypeEnum.Category,
          },
        },
      });
    }
  }, [user, router, searchCategories]);

  const handleChange = (event, categoryId) => {
    if (event.target.checked) {
      // setCategory((prevcategory) => [...prevcategory, categoryId]);
      dispatch(registerIntrestedCategoriesUpdated([...(categoriesSelector as string[]), categoryId]));
    } else {
      // setCategory((prevcategory) => prevcategory.filter((item) => item !== categoryId));
      dispatch(
        registerIntrestedCategoriesUpdated((categoriesSelector as string[]).filter((item) => item !== categoryId))
      );
    }
  };

  const handleSubmitCategories = async () => {
    const res: any = await upsertIntrestedCategories({
      filter: {
        dto: {
          categoryIds: categoriesSelector,
        },
      },
    });
    if (res?.data?.upsertInterestedCategories?.isSuccess) {
      handleRouting();
    }
  };

  const handleRouting = () => {
    router.push(PATH_APP.home.afterRegister.connections);
  };
  console.log(data?.searchGroupCategories?.listDto?.items);
  return (
    <Dialog fullWidth={true} open={showDialog}>
      <DialogTitle>
        <DialogIconButtons router={router} user={user} hasBackIcon />
        <Stack alignItems="center" mt={-5}>
          <TitleAndProgress step={3} userType={user?.userType} />
        </Stack>
        <Stack alignItems="center" mb={3}>
          <Typography variant="h6" color="text.primary">
            Which categories of good cause you are interested in?
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack alignItems="center" mb={2}>
          {isFetching ? (
            <Box m={1}>
              <Loading />
            </Box>
          ) : (
            <Box>
              <FormControl component="fieldset">
                <CheckBoxGroupStyle aria-label="position" row sx={{ maxHeight: viewMore ? 350 : 240 }}>
                  {data?.searchGroupCategories?.listDto?.items?.map((_category) => (
                    <CheckBoxStyle
                      key={_category?.id}
                      control={
                        <Checkbox
                          checked={(categoriesSelector?.findIndex((item) => item === _category?.id) as number) >= 0}
                          sx={{
                            color: 'grey.300',
                            '&.Mui-checked': {
                              '&, & + .MuiFormControlLabel-label': {
                                color: 'primary.main',
                              },
                            },
                          }}
                          onClick={(e) => {
                            handleChange(e, _category?.id);
                          }}
                        />
                      }
                      label={_category?.title as string}
                    />
                  ))}
                </CheckBoxGroupStyle>
              </FormControl>
            </Box>
          )}
        </Stack>
        <Box pl={3}>
          {!viewMore && !isFetching && (
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                setViewMore(true);
              }}
              sx={{ height: 24 }}
            >
              <Icon name="down-arrow" color="primary.main" />
              <Typography>View More</Typography>
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mx={3}>
          <Button variant="outlined" sx={{ borderColor: 'grey.300' }} onClick={handleRouting}>
            <Typography color="grey.900">Skip</Typography>
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            endIcon={<Icon name="right-arrow-1" color="common.white" />}
            onClick={handleSubmitCategories}
            loading={isLoading}
            disabled={!!!categoriesSelector?.length}
          >
            <Typography>Next</Typography>
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
