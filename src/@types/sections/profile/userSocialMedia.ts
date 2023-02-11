import { UserSocialMedia } from '../serverTypes';

export interface PersonSocialMediaType extends Omit<UserSocialMedia, 'id'> {
  id?: string;
}

export type ProfileSocialMediasState = {
  socialMedias: UserSocialMedia[];
  socialMedia?: PersonSocialMediaType;
};
