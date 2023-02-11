import { Descendant } from 'slate';
import { ILocationSelect } from 'src/components/location/LocationSelect';
import { Audience, DeadlineEnum, MediaUrlInputType, PostStatus, UserTypeEnum } from './sections/serverTypes';

export interface ICreateSocialPost {
  audience: Audience;
  text: Descendant[];
  gifs: string;
  location: ILocationSelect | null;
  editMode: boolean;
  id?: string;
  mediaUrls: MediaUrlInputType[];
  fileWithError: string;
}

export interface ICreateComments {
  text: Descendant[];
  id: any;
}

export interface ISocial {
  id: string;
  body?: string | null;
  ownerUserId: string;
  audience?: Audience | null;
  status?: PostStatus | null;
  isDeleted?: boolean | null;
  placeId?: string | null;
  placeDescription?: string | null;
  placeMainText?: string | null;
  placeSecondaryText?: string | null;
  location?: string | null;
  tagIds?: Array<string> | null;
  mentionedUserIds?: Array<string> | null;
  isLikedByUser?: boolean | null;
  isSharedSocialPost?: boolean | null;
  isSharedCampaignPost?: boolean | null;
  userType?: UserTypeEnum | null;
  isMine?: boolean | null;
  videoUrls?: Array<string | null> | null;
  pictureUrls?: Array<string | null> | null;
  createdDateTime?: string | null;
  firstName?: string | null;
  fullName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  userAvatarUrl?: string | null;
  countOfComments?: string | null;
  countOfLikes?: string | null;
  countOfShared?: string | null;
  countOfViews?: string | null;
  postLikerUsers?: Array<{
    id?: string | null;
    avatarUrl?: string | null;
    cognitoUserId?: string | null;
    fullName?: string | null;
    userName?: string | null;
  } | null> | null;
  mentionedUsers?: Array<{
    id?: string | null;
    avatarUrl?: string | null;
    cognitoUserId?: string | null;
    fullName?: string | null;
    userName?: string | null;
  } | null> | null;
  tags?: Array<{ id?: string | null; title?: string | null } | null> | null;
  mediaUrls?: Array<{ isVideo?: boolean | null; url?: string | null } | null> | null;
}

export interface ICampaign {
  id: string;
  body?: string | null;
  title?: string | null;
  ownerUserId: string;
  audience?: Audience | null;
  status?: PostStatus | null;
  isDeleted?: boolean | null;
  placeId?: string | null;
  placeDescription?: string | null;
  target?: any | null;
  deadline?: any | null;
  coverImageUrl?: string | null;
  placeMainText?: string | null;
  placeSecondaryText?: string | null;
  isLikedByUser?: boolean | null;
  userType?: UserTypeEnum | null;
  isMine?: boolean | null;
  location?: string | null;
  tagIds?: Array<string> | null;
  category?: number | null;
  mentionedUserIds?: Array<string> | null;
  videoUrls?: Array<string | null> | null;
  pictureUrls?: Array<string | null> | null;
  createdDateTime?: string | null;
  firstName?: string | null;
  fullName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  userAvatarUrl?: string | null;
  averageRate?: any | null;
  numberOfRates?: string | null;
  raisedMoney?: any | null;
  dayLeft?: number | null;
  numberOfDonations?: string | null;
  countOfComments?: string | null;
  countOfLikes?: string | null;
  countOfShared?: string | null;
  countOfViews?: string | null;
  postLikerUsers?: Array<{
    id?: string | null;
    avatarUrl?: string | null;
    cognitoUserId?: string | null;
    fullName?: string | null;
    userName?: string | null;
  } | null> | null;
  mentionedUsers?: Array<{
    id?: string | null;
    avatarUrl?: string | null;
    cognitoUserId?: string | null;
    fullName?: string | null;
    userName?: string | null;
  } | null> | null;
  tags?: Array<{ id?: string | null; title?: string | null } | null> | null;
  donors?: Array<{
    fullName?: string | null;
    subtitle?: string | null;
    avatarUrl?: string | null;
    donateDate?: string | null;
  } | null> | null;
}

export interface IPost {
  campaign?: ICampaign;
  social?: ISocial;
  share?: ISocial;
}

export interface ISearchedPost {
  id: string;
  body?: string | null;
  ownerUserId: string;
  audience?: Audience | null;
  status?: PostStatus | null;
  isDeleted?: boolean | null;
  location?: string | null;
  tagIds?: Array<string> | null;
  mentionedUserIds?: Array<string> | null;
  videoUrls?: Array<string | null> | null;
  pictureUrls?: Array<string | null> | null;
  createdDateTime?: string | null;
  firstName?: string | null;
  fullName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  userAvatarUrl?: string | null;
  countOfComments?: string | null;
  countOfLikes?: string | null;
  countOfShared?: string | null;
  countOfViews?: string | null;
  placeId?: string | null;
  placeMainText?: string | null;
  placeDescription?: string | null;
  placeSecondaryText?: string | null;
  mediaUrls?: Array<{ isVideo?: boolean | null; url?: string | null } | null> | null;
  tags?: Array<{ id?: string | null; title?: string | null } | null> | null;
  mentionedUsers?: Array<{
    id?: string | null;
    avatarUrl?: string | null;
    cognitoUserId?: string | null;
    fullName?: string | null;
  } | null> | null;
}

export interface ISearchedCampaignPost {
  id?: any | null;
  ownerUserId?: any | null;
  deadlineType?: DeadlineEnum | null;
  body?: string | null;
  headline?: string | null;
  coverImageUrl?: string | null;
  createdDateTime?: any | null;
  expirationDateTime?: any | null;
  target?: any | null;
  numberOfComments?: number | null;
  numberOfLikes?: number | null;
  numberOfShared?: number | null;
  numberOfViews?: number | null;
}

export interface ISendPost {
  audience: Audience;
  mediaUrls: any[];
  text: Descendant[];
  editMode: boolean;
  id?: string;
  postType?: string;
}
export interface ISharePost {
  audience: Audience;
  mediaUrls: any[];
  text: Descendant[];
  editMode: boolean;
  id?: string;
  sharePostId?: string;
  postType?: string;
  sharedPostType?: string;
  location: ILocationSelect | null;
}
