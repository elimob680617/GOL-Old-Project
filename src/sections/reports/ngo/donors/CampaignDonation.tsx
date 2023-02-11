import { useEffect } from 'react';
// @mui
import { Avatar, AvatarGroup, Box, Stack, Typography, useTheme } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
//iconSax
import { ArrowRight2 } from 'iconsax-react';
//icon
import { Icon } from 'src/components/Icon';

//service
import { useLazyGetCampaignDetailsInfoQuery } from 'src/_requests/graphql/history/queries/getCampaignDetailsInfo.generated';
//...
//...........................................................................
//..style
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
//......................................
//...type
interface donationDetailsTypes {
  campaignId?: string;
}
//.....................
function CampaignDonation(props: donationDetailsTypes) {
  const { campaignId } = props;
  const [getCampaignDetailsInfo, { data: campaignDetailsInfoData }] = useLazyGetCampaignDetailsInfoQuery();
  const campaignDetailsInfo = campaignDetailsInfoData?.getCampaignDetailsInfo?.listDto?.items?.[0];

  const theme = useTheme();
  const raisedMoneyNum = Number(campaignDetailsInfo?.raisedFund);
  const targetNum = Number(campaignDetailsInfo?.target);

  useEffect(() => {
    if (campaignId) {
      getCampaignDetailsInfo({ filter: { dto: { campaignId } } });
    }
  }, [campaignId, getCampaignDetailsInfo]);
  return (
    <>
      <Typography variant="subtitle2" color="primary.main" sx={{ mb: 3 }}>
        {campaignDetailsInfo?.campaignName || '-'}
      </Typography>
      {!!campaignDetailsInfo?.raisedFund ? (
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="primary.main">
            ${campaignDetailsInfo?.raisedFund?.toLocaleString()} raised of $
            {campaignDetailsInfo?.target?.toLocaleString()}
          </Typography>

          {!(campaignDetailsInfo?.raisedFund === campaignDetailsInfo?.target) ? (
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
                  bgcolor: 'warning.dark',
                },
              }}
            />
          )}
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="primary.main">
            $0 raised of $999,999,999
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
        </Stack>
      )}

      <Stack direction={'row'} mt={4} mb={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.primary">
          {!!campaignDetailsInfo?.donors ? `${campaignDetailsInfo?.donors} people donated.` : ' No donation.'}
        </Typography>
        <Box sx={{ bgcolor: 'background.neutral', p: 1, borderRadius: 0.5 }}>
          <Typography variant="subtitle2" color="primary.dark">
            {campaignDetailsInfo?.daysLeft}
          </Typography>
        </Box>
      </Stack>
      <Stack direction={'row'} sx={{ alignItems: 'center' }} mb={3}>
        {!!campaignDetailsInfo?.numberOfRates && !!campaignDetailsInfo?.numberOfRates ? (
          <>
            <Icon name="star" color="warning.dark" type="solid" />
            <Typography variant="subtitle2" color="warning.dark" sx={{ mr: 0.5, ml: 0.5 }}>
              {campaignDetailsInfo?.averageRate}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, ml: 0.5 }}>
              ({campaignDetailsInfo?.numberOfRates} Rated)
            </Typography>
          </>
        ) : (
          <>
            <Icon name="star" color="grey.500" type="solid" />

            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, ml: 0.5 }}>
              (No rate)
            </Typography>
          </>
        )}
      </Stack>
      <Stack>
        <DonorCardStyled>
          <Stack direction={'row'}>
            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'background.neutral' }}>
              <Icon name="Poverty-Alleviation" color="primary.main" type="linear" />
            </Box>

            <Box sx={{ ml: 1 }}>
              <Typography variant="body1" color="text.primary">
                Donors
              </Typography>
              <Stack direction={'row'} sx={{ mt: 0.5 }}>
                {!!campaignDetailsInfo?.donors ? (
                  <>
                    <Stack spacing={0.5} direction="row" alignItems="center">
                      <AvatarGroup max={4} total={0}>
                        {/* {campaignDetailsInfo.map((item, index) => ( */}
                        <Avatar
                          sx={{ width: 16, height: 16 }}
                          alt="avatar"
                          src={campaignDetailsInfo?.averageRate || undefined}
                        />
                        {/* ))} */}
                      </AvatarGroup>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      Click to see the all donors
                    </Typography>
                  </>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No donors here
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
          <ArrowRight2 />
        </DonorCardStyled>
      </Stack>

      {/* <DonorsListDialog  open={openDonorsDialog} onClose={() => setOpenDonorsDialog(false)} /> */}
    </>
  );
}

export default CampaignDonation;
