import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import NextLink from 'next/link';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Image from 'next/image';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 0 : 800],
  },
}));
interface donationDetailsTypes {
  dayleft: number;
  numberOfDonations: string;
  numberOfRates: string;
  averageRate: string;
  raisedMoney: string;
  target: string;
  isShared?: boolean;
}
function PostDonationDetails(props: donationDetailsTypes) {
  const { dayleft, numberOfDonations, averageRate, numberOfRates, raisedMoney, target, isShared = false } = props;
  const theme = useTheme();
  const raisedMoneyNum = Number(raisedMoney);
  const targetNum = Number(target);

  return (
    <Stack spacing={2} sx={{ backgroundColor: theme.palette.grey[100], borderRadius: 1, p: 2, m: 2 }}>
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

        <Box sx={{ backgroundColor: theme.palette.surface.main, p: 1, borderRadius: 0.5 }}>
          {dayleft ? (
            <>
              {dayleft > 0 && (
                <Typography variant="subtitle2" color={theme.palette.primary.dark}>
                  {dayleft} days left
                </Typography>
              )}
            </>
          ) : (
            <>
              {dayleft === 0 ? (
                <Typography variant="subtitle2" color={theme.palette.warning.dark}>
                  Expired
                </Typography>
              ) : (
                <Typography variant="subtitle2" color={theme.palette.primary.dark}>
                  No deadline
                </Typography>
              )}
            </>
          )}
        </Box>
      </Stack>

      <Stack direction={'row'} sx={{ alignItems: 'center' }}>
        {!!averageRate ? (
          <Image src="/icons/star-shape-solid/24/Outline.svg" width={24} height={24} alt="star-shape-solid" />
        ) : (
          <Image src="/icons/star-shape-linear/24/Outline.svg" width={24} height={24} alt="star-shape-linear" />
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

      {!isShared && (
        <Stack sx={{ mt: '24px !important', mb: '8px !important' }}>
          <NextLink href="#" passHref>
            <Button variant="contained" size="small">
              <Typography variant="body2">Donate</Typography>
            </Button>
          </NextLink>
        </Stack>
      )}
    </Stack>
  );
}

export default PostDonationDetails;
