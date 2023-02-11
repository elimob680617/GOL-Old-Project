import { PersonSchool } from '../serverTypes';

export interface UserSchoolType extends Omit<PersonSchool, 'id'> {
  id?: string;
  isChange?: boolean;
  isValid?: boolean;
}

export interface profileSchoolState {
  school?: UserSchoolType;
  // colleges?:UserCollegeType[],
  // university?:,
}
