import { useSnackbar } from 'notistack';
import { useState } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { Box, Divider, Typography, Stack, MenuItem, Avatar } from '@mui/material';
// routes
import { PATH_APP, PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();

  const { user, logout } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    localStorage.removeItem('closeWizard');
    localStorage.removeItem('closeWizardNgo');

    try {
      await logout();
      router.replace(PATH_AUTH.signIn);

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };
  return (
    <>
      <IconButtonAnimate onClick={handleOpen} size="large">
        {/* <Stack alignItems="center" direction="row"> */}
        <Avatar
          src={user?.avatarUrl || ''}
          variant={user?.userType === UserTypeEnum.Normal ? 'circular' : 'rounded'}
          sx={{ width: 24, height: 24 }}
        />
        {/* <img width={SIZES.icon} height={SIZES.icon} alt="account" src="/icons/down arrow/24/Outline.svg" /> */}
        {/* </Stack> */}
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.userType === UserTypeEnum.Normal ? `${user?.firstName} ${user?.lastName}` : user?.fullName} {}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {/* {MENU_OPTIONS.map((option) => ( */}
          <NextLink href={PATH_APP.root} passHref>
            <MenuItem onClick={handleClose}>{'Home'}</MenuItem>
          </NextLink>
          <NextLink
            href={user?.userType === UserTypeEnum.Normal ? PATH_APP.profile.user.root : PATH_APP.profile.ngo.root}
            passHref
          >
            <MenuItem onClick={handleClose}>{'Profile'}</MenuItem>
          </NextLink>
          <NextLink href={PATH_APP.root} passHref>
            <MenuItem onClick={handleClose}>{'Setting'}</MenuItem>
          </NextLink>
          <NextLink href={'/report/garden/'} passHref>
            <MenuItem onClick={handleClose}>{'Application Report'}</MenuItem>
          </NextLink>
          {/* // ))} */}
          {/* {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: '/profile/user',
  },
  {
    label: 'Settings',
    linkTo: PATH_APP.root,
  }, */}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
