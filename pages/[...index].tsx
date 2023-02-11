import { Box, Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from 'src/layouts';
import MyConnectionsDonors from 'src/sections/home/MyConnectionsDonors';
import Tops from 'src/sections/home/Tops';
import Ads from 'src/sections/home/Ads';
import Menu from 'src/sections/home/Menu';
import GoPremium from 'src/sections/home/GoPremium';
import Helpers from 'src/sections/home/Helpers';
import HomePosts from 'src/sections/home/HomePosts';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import afterSignUpRouts from 'src/sections/auth/sign-up/questions/afterSignUpRouts';
import wizardRoutes from 'src/sections/profile/user/wizard/wizardRoutes';
import ngoWizardRoutes from 'src/sections/profile/ngo/wizard/ngoWizardRoutes';
// MAIN
import MainProfileBirthdayDialog from 'src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileBirthdayDialog';
import MainProfileChangePhotoDialog from 'src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileChangePhotoDialog';
import MainProfileCoverAvatarDialog from 'src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileCoverAvatarDialog';
import MainProfileDiscardDialog from 'src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileDiscardDialog';
import MainProfileEditDialog from 'src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileEditDialog';
import MainProfileGenderDialog from 'src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileGenderDialog';
import MainProfileChangeCoverUser from 'src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileChangeCoverUser';
import MainProfileCoverAvatarUser from 'src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileCoverAvatarUser';
import MainProfileDeleteCoverAvatarDialog from 'src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileDeleteCoverAvatarDialog';
import experienceRoutes from 'src/sections/profile/user/owner/userExperiences/experienceRoutes';
import userPublicDetailsRoute from 'src/sections/profile/user/owner/userPublicDetails/userPublicDetailsRoute';
import userContactInfoRoute from 'src/sections/profile/user/owner/userContactInfo/userContactInfoRoute';
import ngoPublicDetailsRoutes from 'src/sections/profile/ngo/owner/ngoPublicDetails/ngoPublicDetailsRoutes';
import ngoContactInfoRoutes from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoContactInfoRoutes';
import ngoCertificateRoutes from 'src/sections/profile/ngo/owner/ngoCertificates/ngoCertificateRoutes';
import projectRoutes from 'src/sections/profile/ngo/owner/ngoProject/projectRoutes';
import BioDialog from 'src/sections/profile/ngo/owner/ngoMain/BioDialog';
import MainProfileNGOCoverAvatarDialog from 'src/sections/profile/ngo/owner/ngoMain/MainProfileNGOCoverAvatarDialog';

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  paddingTop: theme.spacing(3),
}));
const pageSector: Record<string, ReactNode | null> = {
  ...experienceRoutes,
  ...userPublicDetailsRoute,
  ...ngoPublicDetailsRoutes,
  ...userContactInfoRoute,
  ...ngoContactInfoRoutes,
  ...ngoCertificateRoutes,
  ...projectRoutes,
  ...afterSignUpRouts,
  ...wizardRoutes,
  ...ngoWizardRoutes,
  userEdit: <MainProfileEditDialog />,
  'bio-dialog': <BioDialog />,
  'userEdit-birthday': <MainProfileBirthdayDialog />,
  'userEdit-gender': <MainProfileGenderDialog />,
  'userEdit-cover': <MainProfileCoverAvatarDialog />,
  'userEdit-avatar': <MainProfileCoverAvatarDialog isAvatar />,
  'userEdit-change-photo-cover': <MainProfileChangePhotoDialog />,
  'userEdit-change-photo-avatar': <MainProfileChangePhotoDialog isProfilePhoto />,
  'userEdit-save-change': <MainProfileDiscardDialog />,
  'userEdit-change-avatar': <MainProfileChangeCoverUser isProfilePhoto />,
  'userEdit-change-cover': <MainProfileChangeCoverUser />,
  'userEdit-add-avatar': <MainProfileCoverAvatarUser isAvatar />,
  'userEdit-add-cover': <MainProfileCoverAvatarUser />,
  'userEdit-delete-avatar': <MainProfileDeleteCoverAvatarDialog isProfilePhoto />,
  'userEdit-delete-cover': <MainProfileDeleteCoverAvatarDialog />,
  'ngoEdit-cover': <MainProfileNGOCoverAvatarDialog />,
  'ngoEdit-avatar': <MainProfileNGOCoverAvatarDialog isAvatar />,
};
// ----------------------------------------------------------------------

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

export default function HomePage() {
  const { query } = useRouter();

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.neutral', minHeight: 'calc(100vh - 64px)' }}>
      <Container sx={{ p: { md: 0 } }}>
        <RootStyle>
          <Stack spacing={7.5} direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={4} sx={{ width: 264 }}>
              <Menu />
              <GoPremium />
              <Helpers />
            </Stack>
            <HomePosts />
            <Stack spacing={1.5} sx={{ width: 264 }}>
              <MyConnectionsDonors />
              <Tops />
              <Ads />
            </Stack>
          </Stack>
        </RootStyle>
      </Container>
      {pageSector[query.index as string]}
    </Box>
  );
}
