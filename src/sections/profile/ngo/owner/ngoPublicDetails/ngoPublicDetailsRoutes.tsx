import React, { ReactNode } from 'react';
import EstablishedDateDialog from './ngEstablishedDate/EstablishedDateDialog';
import EstablishedDateUpdateDialog from './ngEstablishedDate/EstablishedDateUpdateDialog';
import EstablishmentDiscardDialog from './ngEstablishedDate/EstablishmentDiscardDialog';
import EstablishmentDeleteDialog from './ngEstablishedDate/EstablishmentDeleteDialog';
import SelectAudienceEstablishedDateDialog from './ngEstablishedDate/SelectAudienceEstablishedDateDialog';
import CategoryDiscardDialog from './ngoCategory/CategoryDiscardDialog';
import CategoryDeleteDialog from './ngoCategory/CategoryDeleteDialog';
import CategoryTypeDialog from './ngoCategory/CategoryTypeDialog';
import CategoryUpdateDialog from './ngoCategory/CategoryUpdateDialog';
import SelectAudienceCategoryDialog from './ngoCategory/SelectAudienceCategoryDialog';
import LocationDeleteDialog from './ngoLocation/LocationDeleteDialog';
import LocationDiscardDialog from './ngoLocation/LocationDiscardDialog';
import LocationNameDialog from './ngoLocation/LocationNameDialog';
import LocationUpdateDialog from './ngoLocation/LocationUpdateDialog';
import SelectAudienceLocationDialog from './ngoLocation/SelectAudienceLocationDialog';
import NGOPublicDetailsMainDialog from './NGOPublicDetailsMainDialog';
import SizeDiscardDialog from './ngoSize/SizeDiscardDialog';
import SizeDeleteDialog from './ngoSize/SizeDeleteDialog';
import SizeSelectAudienceDialog from './ngoSize/SizeSelectAudienceDialog';
import SizeStatusDialog from './ngoSize/SizeStatusDialog';
import SizeUpdateDialog from './ngoSize/SizeUpdateDialog';
import SelectAudienceMainDialog from 'src/sections/profile/ngo/owner/ngoPublicDetails/SelectAudienceMainDialog';

const ngoPublicDetailsRoutes: Record<string, ReactNode> = {
  'public-details': <NGOPublicDetailsMainDialog />,
  'select-audience-main': <SelectAudienceMainDialog />,
  //CATEGORY
  'public-details-category': <CategoryUpdateDialog />,
  'public-details-category-audience': <SelectAudienceCategoryDialog />,
  'public-details-select-category': <CategoryTypeDialog />,
  'public-details-delete-category': <CategoryDeleteDialog />,
  'public-details-edit-category': <CategoryUpdateDialog />,
  'public-details-discard-category': <CategoryDiscardDialog />,
  // SIZE
  'public-details-size': <SizeUpdateDialog />,
  'public-details-edit-size': <SizeUpdateDialog />,
  'public-details-size-audience': <SizeSelectAudienceDialog />,
  'public-details-select-size': <SizeStatusDialog />,
  'public-details-delete-size': <SizeDeleteDialog />,
  'public-details-discard-size': <SizeDiscardDialog />,
  // ESTABLISHMENT DATE
  'public-details-establishment': <EstablishedDateUpdateDialog />,
  'public-details-edit-establishment': <EstablishedDateUpdateDialog />,
  'public-details-established-date': <EstablishedDateDialog />,
  'public-details-establishment-audience': <SelectAudienceEstablishedDateDialog />,
  'public-details-delete-established-date': <EstablishmentDeleteDialog />,
  'public-details-discard-established-date': <EstablishmentDiscardDialog />,
  // PLACE
  'public-details-place': <LocationUpdateDialog />,
  'public-details-located-in': <LocationNameDialog />,
  'public-details-edit-place': <LocationUpdateDialog />,
  'public-details-place-audience': <SelectAudienceLocationDialog />,
  'public-details-delete-place': <LocationDeleteDialog />,
  'public-details-discard-place': <LocationDiscardDialog />,
};

export default ngoPublicDetailsRoutes;
