import { Location, Relationship, AudienceEnum } from '../serverTypes';

export interface ProfilePublicDetailsState {
  relationShip?: RelationshipType;
}
export interface RelationshipType extends Relationship {
  isChange?: boolean;
}

export interface UserLocationState {
  city?: LocationType;
}

export interface LocationType extends Omit<Location, 'id' | 'personId' | 'cityId'> {
  id?: string;
  personId?: string;
  cityId?: string;
  isChange?: boolean;
  isValid?: boolean;
}
export interface joinAudiencePersonType {
  audience?: AudienceEnum;
}
