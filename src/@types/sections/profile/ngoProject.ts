import { Project } from '../serverTypes';

export type ProfileProjectState = {
  project?: ProjectType;
};
export interface ProjectType extends Project {
  isChange?: boolean;
  isValid?: boolean;
}
