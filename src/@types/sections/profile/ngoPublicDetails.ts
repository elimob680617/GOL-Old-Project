import { AudienceEnum } from '../serverTypes';

export type GroupCategoryPayloadType = {
  id?: string;
  title?: string;
  categoryAudience?: AudienceEnum;
  isChange?: boolean;
  iconUrl?: string;
};
export type NumberRangePayloadType = {
  desc?: string;
  id?: string;
  sizeAudience?: AudienceEnum;
  isChange?: boolean;
};
export type EstablishmentdDatePayloadType = {
  establishmentDate?: Date;
  establishmentDateAudience?: AudienceEnum;
  isChange?: boolean;
};
export type PlacePayloadType = {
  id?: string;
  placeAudience?: AudienceEnum;
  description?: string;
  placeId?: string;
  address?: string;
  mainText?: string;
  secondaryText?: string;
  isChange?: boolean;
  lat?: any;
  lng?: any;
};
export type NGOPublicDetailsState = {
  categoryGroup?: GroupCategoryPayloadType;
  rangeNumber?: NumberRangePayloadType;
  establishedDate?: EstablishmentdDatePayloadType;
  place?: PlacePayloadType;
};

export type GroupCategoryType = Pick<GroupCategoryPayloadType, 'id' | 'title' | 'categoryAudience'>;
export type NumberRangeType = Pick<NumberRangePayloadType, 'id' | 'desc' | 'sizeAudience'>;
export type EstablishmentdDateType = Pick<
  EstablishmentdDatePayloadType,
  'establishmentDate' | 'establishmentDateAudience'
>;
export type PlaceType = Pick<PlacePayloadType, 'description' | 'id' | 'placeAudience' | 'mainText' | 'secondaryText'>;
