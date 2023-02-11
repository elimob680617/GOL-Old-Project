import { Button, Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';

export const HashtagItemStyle = styled(Stack)(({ theme }) => ({}));

const ButtonStyle = styled(Button)(({ theme }) => ({
  px: 2.9,
  py: 0.5,
  width: 80,
  height: 32,
}));

const HashtagItem: FC<{ name: string }> = ({ name }) => (
  <>
    <HashtagItemStyle direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 48,
            height: 48,
            border: (theme) => `1px solid ${theme.palette.grey[100]}`,
            borderRadius: '48px',
          }}
        >
          #
        </Stack>
        <Typography variant="subtitle1" color="surface.onSurface">
          {name}
        </Typography>
      </Stack>

      {/* <Button
            variant="contained"
            color="primary"
            startIcon={<UserAdd />}
            size="small"
          >
            <Typography variant="button">Follow</Typography>
          </Button> */}
      {/* <ButtonStyle variant="text" size="small" sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
        <Typography variant="button" color="text.primary">
          Unfollow
        </Typography>
      </ButtonStyle> */}
    </HashtagItemStyle>
  </>
);

export default HashtagItem;
