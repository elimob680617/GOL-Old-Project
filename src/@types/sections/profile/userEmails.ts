import { UserEmail } from '../serverTypes';

export interface PersonEmailType extends Omit<UserEmail, 'id' | 'userId'> {
  id?: string;
  userId?: string;
}

export type ProfileEmailsState = {
  emails: UserEmail[];
  email?: PersonEmailType;
};
