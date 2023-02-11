import { Certificate } from '../serverTypes';

export interface CertificateType extends Omit<Certificate, 'id'> {
  id?: string;
  isChange?: boolean;
  isValid?: boolean;
}

export interface profileCertificateState {
  certificate?: CertificateType;
}
