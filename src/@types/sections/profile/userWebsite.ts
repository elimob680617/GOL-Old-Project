import { UserWebSite } from '../serverTypes';

export interface PersonWebSiteType extends Omit<UserWebSite, 'id' | 'userId'> {
  id?: string;
  userId?: string;
}

export interface userWebsiteState {
  website?: PersonWebSiteType;
}
