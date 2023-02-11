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
import { PATH_APP } from 'src/routes/paths';
// hooks
import { useRouter } from 'next/router';
import { useLayoutEffect, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
// components
import { Icon } from 'src/components/Icon';
import TitleAndProgress from '../common/TitleAndProgress';
import { Loading } from 'src/components/loading';
// services
import { registerJoinReasonsSelector, registerJoinReasonsUpdated } from 'src/redux/slices/afterRegistration';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import { useDispatch, useSelector } from 'src/redux/store';
import { useUpsertOrganizationUserReasonsJoinMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/upserReasonsJoin.generated';
import { useLazyReasonsJoinQuery } from 'src/_requests/graphql/profile/ngoPublicDetails/queries/reasonsJoin.generated';
import DialogIconButtons from '../common/DialogIconButtons';

const CheckBoxStyle = styled(FormControlLabel)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.grey[100],
  paddingInline: theme.spacing(3),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  width: 491,
  height: 48,
  display: 'flex',
  justifyContent: 'space-between',
  marginInline: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));
const CheckBoxGroupStyle = styled(FormGroup)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export default function SelectJoinReason() {
  const { user } = useAuth();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState<boolean>(true);
  const dispatch = useDispatch();
  const reasonsSelector = useSelector(registerJoinReasonsSelector);

  const [reasonsJoin, { data, isFetching }] = useLazyReasonsJoinQuery();
  const [upsertOrganizationUserReasonsJoin, { isLoading }] = useUpsertOrganizationUserReasonsJoinMutation();

  useLayoutEffect(() => {
    if (router.query.index?.[0] === 'reasons' && user?.completeQar) {
      setShowDialog(false);
      router.push(PATH_APP.home.index);
    }
    if (user?.userType !== UserTypeEnum.Ngo) {
      router.push(PATH_APP.home.afterRegister.welcome);
    } else {
      reasonsJoin({
        filter: {
          dto: {},
        },
      });
    }
  }, [user, reasonsJoin, router]);

  const handleChange = (event, reasonId) => {
    if (event.target.checked) {
      dispatch(registerJoinReasonsUpdated([...(reasonsSelector as string[]), reasonId]));
    } else {
      dispatch(registerJoinReasonsUpdated((reasonsSelector as string[]).filter((item) => item !== reasonId)));
    }
  };

  const handleSubmitReasons = async () => {
    const res: any = await upsertOrganizationUserReasonsJoin({
      filter: {
        dto: {
          reasonsJoinId: reasonsSelector,
        },
      },
    });
    if (res?.data?.upsertOrganizationUserReasonsJoin?.isSuccess) {
      handleRouting();
    }
  };

  const handleRouting = () => {
    router.push(PATH_APP.home.afterRegister.connections);
  };

  return (
    <Dialog fullWidth={true} open={showDialog}>
      <DialogTitle>
        <DialogIconButtons router={router} user={user} hasBackIcon />
        <Stack alignItems="center" mt={-5}>
          <TitleAndProgress step={3} userType={user?.userType} />
        </Stack>
        <Stack alignItems="center" mb={3}>
          <Typography variant="h6" color="text.primary">
            Why are you joining GOL?
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack alignItems={'center'}>
          {isFetching ? (
            <Box m={1}>
              <Loading />
            </Box>
          ) : (
            <Box>
              <FormControl component="fieldset">
                <CheckBoxGroupStyle aria-label="position" row>
                  {data?.reasonsJoin?.listDto?.items?.map((_reason) => (
                    <CheckBoxStyle
                      key={_reason?.id}
                      sx={{
                        borderColor:
                          (reasonsSelector?.findIndex((item) => item === _reason?.id) as number) >= 0
                            ? 'primary.main'
                            : 'grey.100',
                      }}
                      control={
                        <Checkbox
                          checked={(reasonsSelector?.findIndex((item) => item === _reason?.id) as number) >= 0}
                          sx={{
                            color: 'grey.300',
                            '&.Mui-checked': {
                              '&, & + .MuiFormControlLabel-label': {
                                color: 'primary.main',
                              },
                            },
                          }}
                          onClick={(e) => {
                            handleChange(e, _reason?.id);
                          }}
                        />
                      }
                      label={_reason?.title as string}
                      labelPlacement="start"
                    />
                  ))}
                </CheckBoxGroupStyle>
              </FormControl>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mx={3} onClick={handleRouting}>
          <Button variant="outlined" sx={{ borderColor: 'grey.300' }}>
            <Typography color="grey.900">Skip</Typography>
          </Button>

          <LoadingButton
            variant="contained"
            color="primary"
            endIcon={<Icon name="right-arrow-1" color="common.white" />}
            loading={isLoading}
            disabled={!reasonsSelector?.length}
            onClick={handleSubmitReasons}
          >
            <Typography>Next</Typography>
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
