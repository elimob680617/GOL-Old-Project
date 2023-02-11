import { ReactNode } from 'react';
import DeleteSkillDialog from 'src/sections/profile/user/owner/userSkills/DeleteSkillDialog';
import SearchSkillDialog from 'src/sections/profile/user/owner/userSkills/SearchSkillDialog';
import ShowEndorsementsDialog from 'src/sections/profile/user/owner/userSkills/ShowEndorsementsDialog';
import SkillListDialog from 'src/sections/profile/user/owner/userSkills/SkillListDialog';

const userSkillRoute: Record<string, ReactNode> = {
  'skill-list': <SkillListDialog />,
  'search-skill': <SearchSkillDialog />,
  'show-Endorsements': <ShowEndorsementsDialog />,
  'delete-skill': <DeleteSkillDialog />,
};

export default userSkillRoute;
