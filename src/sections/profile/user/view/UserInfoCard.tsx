import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
// import { Lock, More, Slash, UserRemove } from 'iconsax-react';
// import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import reportMessage from 'public/icons/report-message.svg';
import React from 'react';
import { AccountPrivacyEnum, ConnectionStatusEnum, FilterByEnum, RequestEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useCreateMessageByUserNameMutation } from 'src/_requests/graphql/chat/mutations/createMessageByUserName.generated';
import { useUpdateConnectionMutation } from 'src/_requests/graphql/connection/mutations/updateConnection.generated';
import ProfileButtonChecker from '../../components/ProfileButtonChecker';
import ThreeDotPopOver from '../../components/ThreeDotOnView/ThreeDotPopOver';

const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: '450px',
  borderRadius: theme.spacing(1),
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    minHeight: '520px',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '570px',
  },
}));

const CardContentStyle = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  position: 'absolute',
  top: '185px',
}));
const StackContentStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const CardContentBtn = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(11.5),
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(2),
  },
}));
const MessageBoxStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));
interface UserInfoCardProps {
  //   user:Pick<UserDto, 'personDto'|'connectionDto'|'accountPrivacy'|'userType'> ,
  user: any;
  itemId?: string;
}

export default function UserInfoCard(props: UserInfoCardProps) {
  const { user, itemId } = props;
  const { push } = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [changeStatus, { isLoading }] = useUpdateConnectionMutation();
  const [createMessageByUserName, { isLoading: chatLoading }] = useCreateMessageByUserNameMutation();

  const userIsVisible =
    user?.accountPrivacy === AccountPrivacyEnum.Public ||
    user?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted;

  const userBlockStatus = user?.connectionDto?.meBlockedOther || user?.connectionDto?.otherBlockedMe;

  const handleChangeStatus = async (actionType: RequestEnum) => {
    const res: any = await changeStatus({
      filter: {
        dto: {
          itemId,
          actionType,
        },
      },
    });
    if (res.data.updateConnection.isSuccess) {
      console.log('Unblock');
    }
  };

  const chatHandler = async () => {
    const { data }: any = await createMessageByUserName({
      message: { dto: { toUserId: itemId, text: 'hi', readMessage: false } },
    });
    push(`/chat/${data?.createMessageByUserName.listDto.items[0]?.roomId}`);
  };

  return (
    <>
      <CardStyle sx={{ minHeight: !userIsVisible || userBlockStatus || user?.meReportedOther ? 357 : 450 }}>
        <CardMedia
          component="img"
          alt="Cover Image"
          height={'250px'}
          image={user?.personDto?.coverUrl || '/icons/empty_cover.svg'}
        />
        {/* SEPRATE SHOW BASE ON PUBLIC OR PRIVACY */}
        <CardContentStyle>
          {/* BUTTONS STATUS */}
          <StackContentStyle>
            {/* AVATAR AND USER NAME AND TYPE */}
            <Box>
              <Avatar
                alt={user?.personDto?.fullName}
                src={user?.personDto?.avatarUrl || undefined}
                sx={{
                  width: 80,
                  height: 80,
                  borderColor: 'background.neutral',
                  backgroundColor: 'grey.100',
                }}
              />
              <Typography gutterBottom variant="subtitle1" mt={1}>
                {user?.personDto?.firstName} {user?.personDto?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {!!user?.userType && 'Normal User'}
              </Typography>
            </Box>
            {/* BUTTONS AND CURRENT CITY AND HEADLINE */}
            <CardContentBtn>
              {/* HANDLE THIS BUTTON WHEN CLICK */}
              {!user?.connectionDto?.otherBlockedMe && (
                <Stack direction="row" spacing={3} alignItems="center">
                  {!user?.connectionDto?.meBlockedOther ? (
                    <Stack spacing={3} direction="row">
                      <ProfileButtonChecker
                        fullName={user?.personDto?.fullName}
                        itemId={user?.connectionDto?.itemId}
                        itemType={FilterByEnum.Normal}
                        meToOther={user?.connectionDto?.meToOtherStatus}
                        otherToMe={user?.connectionDto?.otherToMeStatus}
                      />
                      <Link href={PATH_APP.profile.user.root} passHref>
                        <LoadingButton
                          loading={chatLoading}
                          onClick={() => chatHandler()}
                          size="large"
                          variant="outlined"
                          sx={{ height: 32, width: 128, borderColor: 'grey.300' }}
                        >
                          {user?.accountPrivacy !== AccountPrivacyEnum.Public && <Icon name="lock" />}
                          <Typography color="grey.900">Message</Typography>
                        </LoadingButton>
                      </Link>
                    </Stack>
                  ) : (
                    <LoadingButton
                      sx={{ height: 32, width: 280 }}
                      variant="contained"
                      color="primary"
                      onClick={() => handleChangeStatus(RequestEnum.UnBlock)}
                      loading={isLoading}
                    >
                      <Icon name="Block" color="background.paper" />
                      <Typography ml={1}>Unblock</Typography>
                    </LoadingButton>
                  )}
                  <IconButton
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      setAnchorEl(event.currentTarget);
                    }}
                  >
                    <Icon name="Menu" type="solid" />
                  </IconButton>
                </Stack>
              )}
            </CardContentBtn>
          </StackContentStyle>
          {/* HEADLINE AND CURRENT CITY */}
          {userIsVisible && !userBlockStatus && !user?.meReportedOther && (
            <Stack direction={'row'} sx={{ justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
              <Stack alignItems="flex-start">
                <Button size="small" variant="text" sx={{ minWidth: 'unset !important' }}>
                  {/* handle when current City Exists */}
                  <Typography color="text.primary">{user?.personDto?.currnetCity?.city?.name}</Typography>
                </Button>
                {/* handle when headline Exists */}
                <Button size="small" variant="text" sx={{ minWidth: 'unset !important' }}>
                  <Typography color="text.primary">{user?.personDto?.headline}</Typography>
                </Button>
              </Stack>
              <Box>
                <Box sx={{ backgroundColor: 'secondary.main', padding: '16px 8px', borderRadius: 1 }}>
                  <Typography color="background.paper">BGD</Typography>
                </Box>
              </Box>
            </Stack>
          )}
        </CardContentStyle>
      </CardStyle>
      <Grid item lg={12} xs={12}>
        {user?.connectionDto?.otherBlockedMe ? (
          <MessageBoxStyle direction="row" alignItems="center" spacing={1}>
            <Icon name="forbidden" />
            <Typography color="text.primary" variant="subtitle2">
              You have been blocked by this user.
            </Typography>
          </MessageBoxStyle>
        ) : (
          !userIsVisible &&
          !userBlockStatus &&
          !user?.meReportedOther && (
            <MessageBoxStyle direction="row" alignItems="center" spacing={1}>
              <Icon name="lock" type="solid" />
              <Typography color="text.primary" variant="subtitle2">
                This Account is Private.
              </Typography>
            </MessageBoxStyle>
          )
        )}
        {user?.meReportedOther && (
          <MessageBoxStyle direction="row" alignItems="center" spacing={1}>
            <Icon name="Info" />
            <Typography color="text.secondary" variant="subtitle2">
              {user?.personDto?.firstName} is reported by you.
            </Typography>
          </MessageBoxStyle>
        )}
      </Grid>
      <ThreeDotPopOver
        itemId={itemId}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        fullName={user?.personDto?.fullName}
        isFollowing={user?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted}
        isBlocked={user?.connectionDto?.meBlockedOther}
        isReported={user?.meReportedOther}
      />
    </>
  );
}
