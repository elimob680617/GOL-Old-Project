// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, useTheme, IconButton, Stack } from '@mui/material';
// components
import Page from 'src/components/Page';
// sections
import VerifyCodeFormPhoneNumber from 'src/sections/profile/user/owner/userContactInfo/userPhoneNumber/VerifyCodeFormPhoneNumber';
import { ArrowLeft2 } from 'iconsax-react';
import Logo from 'src/components/Logo';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0),
  backgroundColor: theme.palette.grey[300],
}));

// ----------------------------------------------------------------------

export default function Verify() {
  const theme = useTheme();
  return (
    <Page title="Verify" sx={{ height: 1 }}>
      <RootStyle>
        <Container>
          <Box sx={{ maxWidth: 328, mx: 'auto' }}>
            <Stack direction="row" sx={{ position: 'relative', mb: 4 }}>
              <NextLink href="/profile/add-phone-number/" passHref>
                <IconButton edge="start">
                  <ArrowLeft2 color={theme.palette.grey[700]} />
                </IconButton>
              </NextLink>
              <Logo sx={{ position: 'absolute', left: '50%', transform: 'translate(-50%, 0)' }} />
            </Stack>

            <Box sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Typography variant="h4" color="text.primary" sx={{ pt: 3 }}>
                  Is it Really you?
                </Typography>
              </Box>

              <Box sx={{ mt: 8, mb: 3 }}>
                <VerifyCodeFormPhoneNumber />
              </Box>
            </Box>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
