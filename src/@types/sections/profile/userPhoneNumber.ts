import { UserPhoneNumber } from '../serverTypes';

export interface UserPhoneNumberType extends Omit<UserPhoneNumber, 'id' | 'userId'> {
  id?: string;
  userId?: string;
}

export interface userPhoneNumberState {
  phoneNumber?: UserPhoneNumberType;
}
