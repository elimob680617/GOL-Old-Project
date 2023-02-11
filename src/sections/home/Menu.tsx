import { Stack, Typography } from '@mui/material';
import { FC } from 'react';
import CustomLink from 'src/components/CustomLink';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';

const Menu: FC = () => (
  <Stack spacing={3}>
    <CustomLink path={PATH_APP.post.campaginPostLanding}>
      <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
        <Icon name="Campaign" color="grey.900" />
        <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
          Campaigns
        </Typography>
      </Stack>
    </CustomLink>
    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <Icon name="Catrgories" color="grey.900" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        Pages
      </Typography>
    </Stack>
    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <Icon name="Groups" color="grey.900" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        Groups
      </Typography>
    </Stack>

    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <Icon name="Save" color="grey.900" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        Saved
      </Typography>
    </Stack>

    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <Icon name="NFT" color="grey.900" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        NFT
      </Typography>
    </Stack>
  </Stack>
);

export default Menu;
