import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import Layout from 'src/layouts';
// MAIN
import Main from 'src/sections/profile/user/owner/userMain/Main';
import MainProfileBirthdayDialog from 'src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileBirthdayDialog';
import MainProfileChangePhotoDialog from 'src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileChangePhotoDialog';
import MainProfileCoverAvatarDialog from 'src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileCoverAvatarDialog';
import MainProfileDiscardDialog from 'src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileDiscardDialog';
import MainProfileEditDialog from 'src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileEditDialog';
import MainProfileGenderDialog from 'src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileGenderDialog';
import MainProfileChangePhotoUser from 'src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileChangeCoverUser';
import MainProfileCoverAvatarUser from 'src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileCoverAvatarUser';
import MainProfileDeleteCoverAvatarDialog from 'src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileDeleteCoverAvatarDialog';
import experienceRoutes from 'src/sections/profile/user/owner/userExperiences/experienceRoutes';
import userSkillRoute from 'src/sections/profile/user/owner/userSkills/userSkillRoute';
import userCertificateRoute from 'src/sections/profile/user/owner/userCertificates/userCertificateRoute';
import userContactInfoRoute from 'src/sections/profile/user/owner/userContactInfo/userContactInfoRoute';
import userPublicDetailsRoute from 'src/sections/profile/user/owner/userPublicDetails/userPublicDetailsRoute';
import wizardRoutes from 'src/sections/profile/user/wizard/wizardRoutes';
import { Box } from '@mui/material';

const pageSector: Record<string, ReactNode | null> = {
  user: null,
  ...experienceRoutes,
  ...userCertificateRoute,
  ...userContactInfoRoute,
  ...userPublicDetailsRoute,
  ...userSkillRoute,
  ...wizardRoutes,
  // main profile edit
  userEdit: <MainProfileEditDialog />,
  'userEdit-birthday': <MainProfileBirthdayDialog />,
  'userEdit-gender': <MainProfileGenderDialog />,
  'userEdit-cover': <MainProfileCoverAvatarDialog />,
  'userEdit-avatar': <MainProfileCoverAvatarDialog isAvatar />,
  'userEdit-change-photo-cover': <MainProfileChangePhotoDialog />,
  'userEdit-change-photo-avatar': <MainProfileChangePhotoDialog isProfilePhoto />,
  'userEdit-save-change': <MainProfileDiscardDialog />,
  'userEdit-change-avatar': <MainProfileChangePhotoUser isProfilePhoto />,
  'userEdit-change-cover': <MainProfileChangePhotoUser />,
  'userEdit-add-avatar': <MainProfileCoverAvatarUser isAvatar />,
  'userEdit-add-cover': <MainProfileCoverAvatarUser />,
  'userEdit-delete-avatar': <MainProfileDeleteCoverAvatarDialog isProfilePhoto />,
  'userEdit-delete-cover': <MainProfileDeleteCoverAvatarDialog />,
};

function Profile() {
  const { query } = useRouter();
  return (
    <Box sx={{ bgcolor: 'background.neutral' }}>
      <Main />
      {pageSector[query.profile as string]}
    </Box>
  );
}

// ----------------------------------------------------------------------

Profile.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default Profile;
