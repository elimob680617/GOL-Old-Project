// @mui
import { Avatar, AvatarGroup, Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import NextLink from 'next/link';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { ArrowRight2 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import DonorsListDialog from './DonorsListDialog';
import Image from 'next/image';
import { useLazyGetDonorsQueryQuery } from 'src/_requests/graphql/post/post-details/queries/getDonorsQuery.generated';

const DonorCardStyled = styled(Box)(({ theme }) => ({
  padding: 8,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 8,
  border: `1px solid ${theme.palette.grey[100]}`,
  cursor: 'pointer',
}));
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
}));
interface donationDetailsTypes {
  PostId: string;
  dayleft: number;
  numberOfDonations: string;
  numberOfRates: string;
  averageRate: string;
  raisedMoney: string;
  target: string;
  donors?: {
    fullName?: string;
    subtitle?: string;
    avatarUrl?: string;
    donateDate?: string;
  }[];
}
function PostDetailsDonationDetails(props: donationDetailsTypes) {
  const { dayleft, numberOfDonations, averageRate, numberOfRates, raisedMoney, target, donors, PostId } = props;
  const theme = useTheme();
  const raisedMoneyNum = Number(raisedMoney);
  const targetNum = Number(target);
  const [openDonorsDialog, setOpenDonorsDialog] = useState(false);
  const [getDonorsQuery, { data: getDonorsData }] = useLazyGetDonorsQueryQuery();

  useEffect(() => {
    if (PostId)
      getDonorsQuery({
        filter: {
          dto: {
            campaignId: PostId,
          },
        },
      });
  }, [PostId]);

  return (
    <>
      <Stack
        spacing={2}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          p: 2,
          position: 'fixed',
          width: '352px',
        }}
      >
        {!!raisedMoney ? (
          <>
            <Typography variant="subtitle2" color={theme.palette.primary.main}>
              ${raisedMoney?.toLocaleString()} raised of ${target?.toLocaleString()}
            </Typography>

            {!(raisedMoney === target) ? (
              <BorderLinearProgress
                variant="determinate"
                value={(raisedMoneyNum / targetNum) * 100}
                sx={{
                  [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 5,
                    backgroundColor: theme.palette.mode === 'light' ? 'primary' : 'secondary',
                  },
                }}
              />
            ) : (
              <BorderLinearProgress
                variant="determinate"
                value={(raisedMoneyNum / targetNum) * 100}
                sx={{
                  [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 5,
                    backgroundColor: theme.palette.warning.dark,
                  },
                }}
              />
            )}
          </>
        ) : (
          <>
            <Typography variant="subtitle2" color={theme.palette.primary.main}>
              $0 raised of ${target?.toLocaleString()}
            </Typography>
            <BorderLinearProgress
              variant="determinate"
              value={0}
              sx={{
                [`& .${linearProgressClasses.bar}`]: {
                  borderRadius: 5,
                  backgroundColor: theme.palette.mode === 'light' ? 'primary' : 'secondary',
                },
              }}
            />
          </>
        )}

        <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {Number(numberOfDonations) > 0 ? (
            <Typography variant="body2" color={theme.palette.text.primary}>
              {numberOfDonations} people donated.
            </Typography>
          ) : (
            <Typography variant="body2" color={theme.palette.text.primary}>
              No donation.
            </Typography>
          )}

          {dayleft ? (
            <>
              {dayleft > 0 && (
                <Box sx={{ backgroundColor: theme.palette.background.neutral, p: 1, borderRadius: 0.5 }}>
                  <Typography variant="subtitle2" color={theme.palette.primary.dark}>
                    {dayleft} days left
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <>
              {dayleft === 0 ? (
                <Box sx={{ backgroundColor: theme.palette.background.neutral, p: 1, borderRadius: 0.5 }}>
                  <Typography variant="subtitle2" color={theme.palette.warning.dark}>
                    Expired
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ backgroundColor: theme.palette.background.neutral, p: 1, borderRadius: 0.5 }}>
                  <Typography variant="subtitle2" color={theme.palette.primary.dark}>
                    No deadline
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Stack>
        <Stack direction={'row'} sx={{ alignItems: 'center' }}>
          {!!averageRate ? (
            <Image src="/icons/star-shape-solid/24/Outline.svg" width={24} height={24} alt="" />
          ) : (
            <Image src="/icons/star-shape-linear/24/Outline.svg" width={24} height={24} alt="" />
          )}

          {!!averageRate && (
            <Typography variant="subtitle2" color={theme.palette.warning.dark} sx={{ mr: 0.5, ml: 0.5 }}>
              {averageRate}
            </Typography>
          )}
          {!!numberOfRates ? (
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ mr: 0.5, ml: 0.5 }}>
              ({numberOfRates} Rated)
            </Typography>
          ) : (
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ mr: 0.5, ml: 0.5 }}>
              (No rate)
            </Typography>
          )}
        </Stack>
        <Stack sx={{ mt: '24px !important', mb: '8px !important' }}>
          {dayleft === 0 ? (
            <Button variant="contained" size="small" disabled>
              <Typography variant="body2">Donate</Typography>
            </Button>
          ) : (
            <NextLink href="#" passHref>
              <Button variant="contained" size="small">
                <Typography variant="body2">Donate</Typography>
              </Button>
            </NextLink>
          )}
        </Stack>
        <Stack>
          <DonorCardStyled onClick={() => setOpenDonorsDialog(true)}>
            <Stack direction={'row'}>
              <Image src="/icons/Donors.svg" width={48} height={48} alt="" />
              <Box sx={{ ml: 1 }}>
                <Typography variant="body1" color={theme.palette.text.primary}>
                  Donors
                </Typography>
                <Stack direction={'row'} sx={{ mt: 0.5 }}>
                  {!!getDonorsData?.getDonorsQuery?.listDto?.items?.length ? (
                    <>
                      <Stack spacing={0.5} direction="row" alignItems="center">
                        <AvatarGroup spacing="medium" max={4} total={0}>
                          {getDonorsData?.getDonorsQuery?.listDto?.items?.map((item, index) => (
                            <Avatar
                              sx={{ width: 16, height: 16 }}
                              key={`${index}-${item?.fullName} `}
                              alt={item?.fullName || 'avatar'}
                              src={item?.avatarUrl || undefined}
                            />
                          ))}
                        </AvatarGroup>
                      </Stack>
                      <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 0.5 }}>
                        Click to see the all donors
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="caption" color={theme.palette.text.secondary}>
                      No donors here
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
            <ArrowRight2 />
          </DonorCardStyled>
        </Stack>
      </Stack>
      <DonorsListDialog
        PostId={PostId}
        donors={donors}
        open={openDonorsDialog}
        onClose={() => setOpenDonorsDialog(false)}
      />
    </>
  );
}

export default PostDetailsDonationDetails;
