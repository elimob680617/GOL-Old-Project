import { Experience } from '../serverTypes';

export type ProfileExperiencesState = {
  experience?: ExperienceType;
};
export interface ExperienceType extends Experience {
  isChange?: boolean;
  isValid?: boolean;
}
