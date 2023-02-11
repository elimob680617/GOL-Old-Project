import React, { ReactNode } from 'react';
import AddCertificateDialog from 'src/sections/profile/ngo/owner/ngoCertificates/AddCertificateDialog';
import CertificateListDialog from 'src/sections/profile/ngo/owner/ngoCertificates/CertificateListDialog';
import DeleteConfirmDialog from 'src/sections/profile/ngo/owner/ngoCertificates/DeleteConfirmDialog';
import DiscardCertificate from 'src/sections/profile/ngo/owner/ngoCertificates/DiscardCertificateDialog';
import ExpirationDateDialog from 'src/sections/profile/ngo/owner/ngoCertificates/ExpirationDateDialog';
import IssueDateDialog from 'src/sections/profile/ngo/owner/ngoCertificates/IssueDateDialog';
import SearchCertificateNamesDialog from 'src/sections/profile/ngo/owner/ngoCertificates/SearchCertificateNamesDialog';
import SearchIssingOrganization from 'src/sections/profile/ngo/owner/ngoCertificates/SearchIssingOrganizationDialog';
import SelectAudienceCertificateDialog from 'src/sections/profile/ngo/owner/ngoCertificates/SelectAudienceCertificateDialog';

const ngoCertificateRoutes: Record<string, ReactNode> = {
  'certificate-list': <CertificateListDialog />,
  'update-certificate': <AddCertificateDialog />,
  'search-certificate-name': <SearchCertificateNamesDialog />,
  'search-issuing-organization': <SearchIssingOrganization />,
  'certificate-issue-date': <IssueDateDialog />,
  'certificate-expiration-date': <ExpirationDateDialog />,
  'certificate-delete-confirm': <DeleteConfirmDialog />,
  'discard-certificate': <DiscardCertificate />,
  'select-audience-certificate': <SelectAudienceCertificateDialog />,
};

export default ngoCertificateRoutes;
