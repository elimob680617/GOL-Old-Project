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
import Image from 'next/image';
import { LoadingButton } from '@mui/lab';
import Link from 'next/link';
import React from 'react';
import { AccountPrivacyEnum, ConnectionStatusEnum, FilterByEnum, RequestEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { useUpdateConnectionMutation } from 'src/_requests/graphql/connection/mutations/updateConnection.generated';
import ProfileButtonChecker from '../../components/ProfileButtonChecker';
import ThreeDotPopOver from '../../components/ThreeDotOnView/ThreeDotPopOver';
import BGD from '/public/icons/mainNGO/BGD/Group3.svg';

const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: '360px',
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
const CardContentButtons = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(2),
  },
}));
const BgdStyle = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  position: 'absolute',
  right: theme.spacing(2),
  bottom: theme.spacing(15),
  zIndex: 1,
}));
const MessageBoxStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));
const MessageButtonStyle = styled(Button)(({ theme }) => ({
  height: 32,
  minWidth: 128,
  // ml: theme.spacing(2),
  // '@media (max-width:425px)': {
  //   mt: theme.spacing(2),
  //   ml: 0,
  // },
  borderColor: theme.palette.grey[300],
}));

interface NgoInfoCardProps {
  ngo: any;
  itemId?: string;
}

export default function NgoInfoCard(props: NgoInfoCardProps) {
  const { ngo, itemId } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [changeStatus, { isLoading }] = useUpdateConnectionMutation();

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

  return (
    <>
      <CardStyle>
        <CardMedia
          sx={{ cursor: 'pointer' }}
          component="img"
          alt="Cover Image"
          height={'250px'}
          image={ngo?.organizationUserDto?.coverUrl || '/icons/empty_cover.svg'}
        />
        <BgdStyle>
          <Image src={BGD} alt="BGD" />
        </BgdStyle>
        <CardContentStyle>
          <StackContentStyle>
            <Avatar
              variant="rounded"
              alt={ngo?.organizationUserDto?.fullName}
              src={ngo?.organizationUserDto?.avatarUrl || undefined}
              sx={{
                width: 80,
                height: 80,
                borderColor: 'background.neutral',
                backgroundColor: 'grey.100',
              }}
            />
          </StackContentStyle>

          <Stack direction="row" justifyContent="space-between" mt={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography gutterBottom variant="subtitle1" sx={{ mt: 1 }}>
                {ngo?.organizationUserDto?.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ngo?.userType}
              </Typography>
            </Box>
            <CardContentButtons>
              {!ngo?.connectionDto?.otherBlockedMe && (
                <Stack direction="row" spacing={3} alignItems="center">
                  {!ngo?.connectionDto?.meBlockedOther ? (
                    <Stack spacing={3} direction="row">
                      <ProfileButtonChecker
                        fullName={ngo?.organizationUserDto?.fullName}
                        itemId={ngo?.connectionDto?.itemId}
                        itemType={FilterByEnum.Ngo}
                        meToOther={ngo?.connectionDto?.meToOtherStatus}
                        otherToMe={ngo?.connectionDto?.otherToMeStatus}
                      />
                      <Link href="#" passHref>
                        <MessageButtonStyle size="large" variant="outlined">
                          {ngo?.accountPrivacy !== AccountPrivacyEnum.Public && <Icon name="lock" />}
                          <Typography sx={{ ml: 1.5 }} color="text.secondary">
                            Message
                          </Typography>
                        </MessageButtonStyle>
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
            </CardContentButtons>
          </Stack>
        </CardContentStyle>
      </CardStyle>
      <Grid item lg={12} xs={12}>
        {ngo?.connectionDto?.otherBlockedMe && (
          <MessageBoxStyle direction="row" alignItems="center" spacing={1}>
            <Icon name="forbidden" />
            <Typography color="text.primary" variant="subtitle2">
              You have been blocked by this user.
            </Typography>
          </MessageBoxStyle>
        )}
        {ngo?.meReportedOther && (
          <MessageBoxStyle direction="row" alignItems="center" spacing={1}>
            <Icon name="Info" color="grey.500" />
            <Typography color="text.secondary" variant="subtitle2">
              {ngo?.organizationUserDto?.fullName} is reported by you.
            </Typography>
          </MessageBoxStyle>
        )}
      </Grid>
      <ThreeDotPopOver
        itemId={itemId}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        fullName={ngo?.organizationUserDto?.fullName}
        isFollowing={ngo?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted}
        isBlocked={ngo?.connectionDto?.meBlockedOther}
        isReported={ngo?.meReportedOther}
      />
    </>
  );
}
