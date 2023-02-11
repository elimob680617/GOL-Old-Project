import { ReactNode } from 'react';
import ExperienceCompanyDialog from 'src/sections/profile/user/owner/userExperiences/ExperienceCompanyDialog';
import ExperienceDateDialog from 'src/sections/profile/user/owner/userExperiences/ExperienceDateDialog';
import ExperienceDeleteConfirmDialog from 'src/sections/profile/user/owner/userExperiences/ExperienceDeleteConfirmDialog';
import ExperienceDiscardDialog from 'src/sections/profile/user/owner/userExperiences/ExperienceDiscardDialog';
import ExperienceEmploymentDialog from 'src/sections/profile/user/owner/userExperiences/ExperienceEmploymentDialog';
import ExperienceListDialog from 'src/sections/profile/user/owner/userExperiences/ExperienceListDialog';
import ExperienceLocationDialog from 'src/sections/profile/user/owner/userExperiences/ExperienceLocationDialog';
import ExperienceNewDialog from 'src/sections/profile/user/owner/userExperiences/ExperienceNewDialog';
import ExperiencePhotoDialog from 'src/sections/profile/user/owner/userExperiences/ExperiencePhotoDialog';
import ExperienceEditPhotoDialog from './ExperienceEditPhotoDialog';
import SelectExperienceAudienceDialog from './SelectExperienceAudienceDialog';

const experienceRoutes: Record<string, ReactNode> = {
  'experience-list': <ExperienceListDialog />,
  'experience-new': <ExperienceNewDialog />,
  'experience-company': <ExperienceCompanyDialog />,
  'experience-employment-type': <ExperienceEmploymentDialog />,
  'experience-start-date': <ExperienceDateDialog />,
  'experience-end-date': <ExperienceDateDialog isEndDate />,
  'experience-location': <ExperienceLocationDialog />,
  'experience-photo': <ExperiencePhotoDialog />,
  'experience-edit-photo': <ExperienceEditPhotoDialog />,
  'experience-delete': <ExperienceDeleteConfirmDialog />,
  'experience-discard': <ExperienceDiscardDialog />,
  'experience-audience': <SelectExperienceAudienceDialog />,
};

export default experienceRoutes;
