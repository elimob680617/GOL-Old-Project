import { Box, Stack, Typography } from '@mui/material';
import { FC, ReactNode, useEffect, useState } from 'react';
import { CampaignStatusEnumType } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';

const CampaginItem: FC<{
  hasBorder?: boolean;
  status?: CampaignStatusEnumType;
  title: ReactNode;
  date: ReactNode;
  rate?: number;
  price?: string;
  avatar: ReactNode;
}> = ({ date, price, title, hasBorder, rate, status, avatar }) => {
  const [sideBarColor, setSideBarColor] = useState<string>('');
  const [statusText, setStatusText] = useState<string>('');
  useEffect(() => {
    if (!status) return;
    switch (status) {
      case 'INTERRUPTED':
        setSideBarColor('secondary.main');
        setStatusText('Interrupted');
        break;

      case 'FINISHED':
        setSideBarColor('secondary.main');
        setStatusText('Finished');
        break;
      case 'ACTIVE':
        setSideBarColor('primary.main');
        setStatusText('Active');
        break;
    }
  }, [status]);

  return (
    <Stack
      direction="row"
      sx={{
        py: 1,
        px: 2,
        position: 'relative',
        borderRadius: 1,
        ...(hasBorder && { border: (theme) => `1px solid ${theme.palette.grey[100]}` }),
      }}
    >
      {!!status && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            top: 0,
            borderRadius: (theme) => theme.spacing(1, 0, 0, 1),
            bgcolor: sideBarColor,
            width: '8px',
          }}
        />
      )}
      <Stack direction="row" spacing={3.5} sx={{ overflow: 'hidden', width: '100%' }}>
        <Stack sx={{ flex: 1, overflowX: 'hidden' }} direction="row" spacing={1}>
          {avatar}
          <Stack spacing={1} sx={{ overflow: 'hidden' }}>
            {title}
            {status && (
              <Typography variant="caption" color={sideBarColor}>
                {statusText}
              </Typography>
            )}
            {date && date}
          </Stack>
        </Stack>
        {(!!price || !!rate) && (
          <Stack spacing={1}>
            <Typography variant="overline" color="text.primary">
              {price}
            </Typography>
            <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
              <Icon name="star" type="solid" color="error.main" />
              <Typography variant="caption" color="text.secondary">
                Rated:{` ${rate}`}
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default CampaginItem;
