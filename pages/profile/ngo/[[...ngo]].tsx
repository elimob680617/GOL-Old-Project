import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import Layout from 'src/layouts';
import BioDialog from 'src/sections/profile/ngo/owner/ngoMain/BioDialog';
import Main from 'src/sections/profile/ngo/owner/ngoMain/Main';
import MainProfileNGOChangePhotoDialog from 'src/sections/profile/ngo/owner/ngoMain/MainProfileNGOChangePhotoDialog';
import MainProfileNGOCoverAvatarDialog from 'src/sections/profile/ngo/owner/ngoMain/MainProfileNGOCoverAvatarDialog';
import MainProfileNGODeleteDialog from 'src/sections/profile/ngo/owner/ngoMain/MainProfileNGODeleteDialog';
import ngoCertificateRoutes from 'src/sections/profile/ngo/owner/ngoCertificates/ngoCertificateRoutes';
import ngoContactInfoRoutes from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoContactInfoRoutes';
import projectRoutes from 'src/sections/profile/ngo/owner/ngoProject/projectRoutes';
import ngoPublicDetailsRoutes from 'src/sections/profile/ngo/owner/ngoPublicDetails/ngoPublicDetailsRoutes';
import ngoWizardRoutes from 'src/sections/profile/ngo/wizard/ngoWizardRoutes';

const pageSector: Record<string, ReactNode | null> = {
  ngo: null,
  ...projectRoutes,
  // contact-info
  ...ngoContactInfoRoutes,
  // public details
  ...ngoPublicDetailsRoutes,
  // certificate
  ...ngoCertificateRoutes,
  //wizard
  ...ngoWizardRoutes,
  //MainNGO
  'bio-dialog': <BioDialog />,
  'main-profile-ngo-change-avatar-photo': <MainProfileNGOChangePhotoDialog isProfilePhoto />,
  'main-profile-ngo-change-cover-photo': <MainProfileNGOChangePhotoDialog />,
  'ngoEdit-cover': <MainProfileNGOCoverAvatarDialog />,
  'ngoEdit-avatar': <MainProfileNGOCoverAvatarDialog isAvatar />,
  'main-profile-ngo-delete-avatar-dialog': <MainProfileNGODeleteDialog isProfilePhoto />,
  'main-profile-ngo-delete-cover-dialog': <MainProfileNGODeleteDialog />,
};

function Profile() {
  const { query } = useRouter();
  return (
    <Box sx={{ bgcolor: 'background.neutral' }}>
      <Main />
      {pageSector[query.ngo as string]}
    </Box>
  );
}

// ----------------------------------------------------------------------

Profile.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default Profile;
