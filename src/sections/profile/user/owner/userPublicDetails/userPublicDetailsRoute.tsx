import { ReactNode } from 'react';
//public details-MAIN
import AddCurrentCity from 'src/sections/profile/user/owner/userPublicDetails/addCurrentCity/AddCurrentCity';
import CloseDialogCurrentCity from 'src/sections/profile/user/owner/userPublicDetails/addCurrentCity/CloseDialogCurrentCity';
import ConfirmDeleteCurrentCity from 'src/sections/profile/user/owner/userPublicDetails/addCurrentCity/ConfirmDeleteCurrentCity';
import CurrentCity from 'src/sections/profile/user/owner/userPublicDetails/addCurrentCity/CurrentCity';
import SelectAudienceCurrentCityDialog from 'src/sections/profile/user/owner/userPublicDetails/addCurrentCity/SelectAudienceCurrentCityDialog';
import AddHomeTown from 'src/sections/profile/user/owner/userPublicDetails/addHomeTown/AddHomeTown';
import CloseDialogHomeTown from 'src/sections/profile/user/owner/userPublicDetails/addHomeTown/CloseDialogHomeTown';
import ConfirmDeleteHomeTown from 'src/sections/profile/user/owner/userPublicDetails/addHomeTown/ConfirmDeleteHomeTown';
import HomeTown from 'src/sections/profile/user/owner/userPublicDetails/addHomeTown/HomeTown';
import SelectAudienceHomeTownDialog from 'src/sections/profile/user/owner/userPublicDetails/addHomeTown/SelectAudienceHomeTownDialog';
import AddRelationship from 'src/sections/profile/user/owner/userPublicDetails/addRelationship/AddRelationship';
import CloseDialogRelationship from 'src/sections/profile/user/owner/userPublicDetails/addRelationship/CloseDialogRelationship';
import ConfirmDeleteRelationship from 'src/sections/profile/user/owner/userPublicDetails/addRelationship/ConfirmDeleteRelationship';
import RelationshipStatusDialog from 'src/sections/profile/user/owner/userPublicDetails/addRelationship/RelationshipStatus';
import SelectAudienceRelationshipDialog from 'src/sections/profile/user/owner/userPublicDetails/addRelationship/SelectAudienceRelationshipDialog';
// PUBLIC-DETAILS
import CollegeConcenterationDialog from 'src/sections/profile/user/owner/userPublicDetails/education/college/CollegeConcenterationDialog';
import CollegeDateDialog from 'src/sections/profile/user/owner/userPublicDetails/education/college/CollegeDateDialog';
import CollegeDeleteDialog from 'src/sections/profile/user/owner/userPublicDetails/education/college/CollegeDeleteDialog';
import CollegeDiscardDialog from 'src/sections/profile/user/owner/userPublicDetails/education/college/CollegeDiscardDialog';
import CollegeNameDialog from 'src/sections/profile/user/owner/userPublicDetails/education/college/CollegeNameDialog';
import CollegeNewFormDialog from 'src/sections/profile/user/owner/userPublicDetails/education/college/CollegeNewFormDialog';
import SelectAudienceCollegeDialog from 'src/sections/profile/user/owner/userPublicDetails/education/college/SelectAudienceCollegeDialog';
//College
//High School
import SchoolDeleteDialog from 'src/sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolDeleteDialog';
import SchoolDiscardDialog from 'src/sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolDiscardDialog';
import SchoolNameDialog from 'src/sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolNameDialog';
import SchoolNewFormDialog from 'src/sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolNewFormDialog';
import SchoolYearDialog from 'src/sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolYearDialog';
import SelectAudienceSchoolDialog from 'src/sections/profile/user/owner/userPublicDetails/education/highSchool/SelectAudienceSchoolDialog';
import SelectAudienceUniversityDialog from 'src/sections/profile/user/owner/userPublicDetails/education/university/SelectAudienceUniversityDialog';
//University
import UniDateDialog from 'src/sections/profile/user/owner/userPublicDetails/education/university/UniDateDialog';
import UniDeleteDialog from 'src/sections/profile/user/owner/userPublicDetails/education/university/UniDeleteDialog';
import UniDiscardDialog from 'src/sections/profile/user/owner/userPublicDetails/education/university/UniDiscardDialog';
import UniNewFormDialog from 'src/sections/profile/user/owner/userPublicDetails/education/university/UniNewFormDialog';
import UniversityConcenterationDialog from 'src/sections/profile/user/owner/userPublicDetails/education/university/UniversityConcenterationDialog';
import UniversityNameDialog from 'src/sections/profile/user/owner/userPublicDetails/education/university/UniversityNameDialog';
import PublicDetailsMainDialog from 'src/sections/profile/user/owner/userPublicDetails/PublicDetailsMainDialog';
import SelectAudienceMainDialog from 'src/sections/profile/user/owner/userPublicDetails/SelectAudienceMainDialog';

const userPublicDetailsRoute: Record<string, ReactNode> = {
  //public-detail
  'public-details': <PublicDetailsMainDialog />,
  'select-audience-main': <SelectAudienceMainDialog />,
  // current city
  'add-current-city': <AddCurrentCity />,
  'edit-current-city': <AddCurrentCity />,
  'current-city': <CurrentCity />,
  'close-dialog-current-city': <CloseDialogCurrentCity />,
  'confirm-delete-current-city': <ConfirmDeleteCurrentCity />,
  'select-audience-current-city': <SelectAudienceCurrentCityDialog />,
  // home town
  'add-home-town': <AddHomeTown />,
  'edit-home-town': <AddHomeTown />,
  'home-town': <HomeTown />,
  'close-dialog-home-town': <CloseDialogHomeTown />,
  'confirm-delete-home-town': <ConfirmDeleteHomeTown />,
  'select-audience-home-town': <SelectAudienceHomeTownDialog />,
  // relation
  'add-relationship': <AddRelationship />,
  'edit-relationship': <AddRelationship />,
  'relationship-status': <RelationshipStatusDialog />,
  'close-dialog-relationship': <CloseDialogRelationship />,
  'confirm-delete-relationship': <ConfirmDeleteRelationship />,
  'select-audience-relationship': <SelectAudienceRelationshipDialog />,
  // school
  'add-highSchool': <SchoolNewFormDialog />,
  'add-highSchool-name': <SchoolNameDialog />,
  'class-year': <SchoolYearDialog />,
  'edit-highSchool': <SchoolNewFormDialog />,
  'delete-highSchool': <SchoolDeleteDialog />,
  'discard-highSchool': <SchoolDiscardDialog />,
  'select-audience-highSchool': <SelectAudienceSchoolDialog />,
  // college
  'add-collage': <CollegeNewFormDialog />,
  'add-college-name': <CollegeNameDialog />,
  'add-college-concenteration': <CollegeConcenterationDialog />,
  'college-start-date': <CollegeDateDialog />,
  'college-end-date': <CollegeDateDialog isEndDate />,
  'edit-college': <CollegeNewFormDialog />,
  'delete-college': <CollegeDeleteDialog />,
  'discard-college': <CollegeDiscardDialog />,
  'select-audience-college': <SelectAudienceCollegeDialog />,
  // uni
  'add-university': <UniNewFormDialog />,
  'add-university-name': <UniversityNameDialog />,
  'add-university-concenteration': <UniversityConcenterationDialog />,
  'university-start-date': <UniDateDialog />,
  'university-end-date': <UniDateDialog isEndDate />,
  'edit-university': <UniNewFormDialog />,
  'delete-university': <UniDeleteDialog />,
  'discard-university': <UniDiscardDialog />,
  'select-audience-university': <SelectAudienceUniversityDialog />,
};

export default userPublicDetailsRoute;
