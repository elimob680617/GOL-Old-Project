import { ReactNode } from 'react';
// CERTIFICATE
import AddCertificateDialog from 'src/sections/profile/user/owner/userCertificates/AddCertificateDialog';
import CertificateListDialog from 'src/sections/profile/user/owner/userCertificates/CertificateListDialog';
import DeleteConfirmDialog from 'src/sections/profile/user/owner/userCertificates/DeleteConfirmDialog';
import DiscardCertificate from 'src/sections/profile/user/owner/userCertificates/DiscardCertificateDialog';
import ExpirationDateDialog from 'src/sections/profile/user/owner/userCertificates/ExpirationDateDialog';
import IssueDateDialog from 'src/sections/profile/user/owner/userCertificates/IssueDateDialog';
import SearchCertificateNamesDialog from 'src/sections/profile/user/owner/userCertificates/SearchCertificateNamesDialog';
import SearchIssingOrganization from 'src/sections/profile/user/owner/userCertificates/SearchIssingOrganizationDialog';
import SelectAudienceCertificateDialog from './SelectAudienceCertificateDialog';

const userCertificateRoute: Record<string, ReactNode> = {
  // certificate
  'certificate-list': <CertificateListDialog />,
  'add-certificate': <AddCertificateDialog />,
  'search-certificate-name': <SearchCertificateNamesDialog />,
  'search-issuing-organization': <SearchIssingOrganization />,
  'certificate-issue-date': <IssueDateDialog />,
  'certificate-expiration-date': <ExpirationDateDialog />,
  'certificate-delete-confirm': <DeleteConfirmDialog />,
  'discard-certificate': <DiscardCertificate />,
  'select-audience-certificate': <SelectAudienceCertificateDialog />,
};

export default userCertificateRoute;
