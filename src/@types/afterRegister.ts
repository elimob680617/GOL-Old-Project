import { GenderEnum } from './sections/serverTypes';

export enum GenderTsEnum {
  Female = 'FEMALE',
  Male = 'MALE',
  Transgender = 'TRANSGENDER',
  NonBinary = 'NON_BINARY',
  Custom = 'CUSTOM',
}

export interface BasicInfoState {
  gender?: GenderEnum;
  intrestedCategories?: string[];
  workingField?: string;
  joinReasons?: string[];
  location?: LocationPayloadType;
}
export interface LocationPayloadType {
  id?: string;
  title?: string;
}
