import { gql } from 'graphql-request';
import { GenericFilterRequestUserInputType } from 'src/@types/sections/serverTypes';
import type * as ServerTypes from '../../../../../@types/sections/serverTypes';
import { Profile } from 'src/_clients';

export type GetUserQuery = {
  getUser?: {
    isSuccess?: boolean | null;
    messagingKey?: string | null;
    listDto?: {
      count?: any | null;
      items?: Array<{
        completeProfilePercentage?: number;
        completeQar?:boolean;
        userType?: ServerTypes.UserTypeEnum | null;
        accountPrivacy?: ServerTypes.AccountPrivacyEnum;
        personDto?: {
          id: string;
          firstName?: string | null;
          lastName?: string | null;
          fullName?: string | null;
          phoneNumber?: string | null;
          email?: string | null;
          coverUrl?: string | null;
          avatarUrl?: string | null;
          headline?: string | null;
          birthday?: any | null;
          gender?: ServerTypes.GenderEnum | null;
          currnetCity?: {
            id: string;
            personId: string;
            cityId: string;
            locationType?: ServerTypes.LocationTypeEnum | null;
            audience?: ServerTypes.AudienceEnum | null;
            city?: {
              id?: any | null;
              name?: string | null;
              placeId?: string | null;
            } | null;
          } | null;
          hometown?: {
            id: string;
            personId: string;
            cityId: string;
            locationType?: ServerTypes.LocationTypeEnum | null;
            audience?: ServerTypes.AudienceEnum | null;
            city?: {
              id?: any | null;
              name?: string | null;
              placeId?: string | null;
            } | null;
          } | null;
          relationship?: {
            personId?: any | null;
            audience?: ServerTypes.AudienceEnum | null;
            relationshipStatus?: {
              id?: any | null;
              title?: string | null;
            } | null;
          } | null;
          personCurrentExperiences?: Array<{
            id?: any | null;
            title?: string | null;
            description?: string | null;
            employmentType?: ServerTypes.EmploymentTypeEnum | null;
            audience?: ServerTypes.AudienceEnum | null;
            startDate?: any | null;
            endDate?: any | null;
            stillWorkingThere?: boolean | null;
            companyId?: any | null;
            mediaUrl?: string | null;
            companyDto?: {
              id?: any | null;
              title?: string | null;
              logoUrl?: string | null;
            } | null;
            cityDto?: {
              id?: any | null;
              name?: string | null;
              placeId?: string | null;
              countryId?: any | null;
            } | null;
            dateDiff?: {
              years?: number | null;
              months?: number | null;
              days?: number | null;
            } | null;
          } | null> | null;
          experience?: {
            id?: any | null;
            title?: string | null;
            description?: string | null;
            employmentType?: ServerTypes.EmploymentTypeEnum | null;
            audience?: ServerTypes.AudienceEnum | null;
            startDate?: any | null;
            endDate?: any | null;
            stillWorkingThere?: boolean | null;
            companyId?: any | null;
            mediaUrl?: string | null;
            companyDto?: {
              id?: any | null;
              title?: string | null;
              logoUrl?: string | null;
            } | null;
            cityDto?: {
              id?: any | null;
              name?: string | null;
              placeId?: string | null;
            } | null;
            dateDiff?: {
              years?: number | null;
              months?: number | null;
              days?: number | null;
            } | null;
          } | null;
          personSchools?: Array<{
            id: string;
            year?: number | null;
            audience?: ServerTypes.AudienceEnum | null;
            school?: { id: string; title?: string | null } | null;
          } | null> | null;
          personUniversities?: Array<{
            id: string;
            personDto?: { id: string } | null;
            collegeDto?: {
              id: string;
              instituteType?: ServerTypes.InstituteTypeEnum | null;
              name?: string | null;
              alphaTwoCode?: string | null;
              country?: string | null;
              stateProvince?: string | null;
              webSiteUrl1?: string | null;
              webSiteUrl2?: string | null;
            } | null;
          } | null> | null;
        } | null;
        organizationUserDto?: {
          id: string;
          organizationUserType?: ServerTypes.OrganizationUserTypeEnum | null;
          groupCategoryId?: any | null;
          placeId?: any | null;
          avatarUrl?: string | null;
          coverUrl?: string | null;
          fullName?: string | null;
          joinDateTime?: any | null;
          joinAudience?: ServerTypes.AudienceEnum | null;
          establishmentDate?: any | null;
          sizeAudience?: ServerTypes.AudienceEnum | null;
          establishmentDateAudience?: ServerTypes.AudienceEnum | null;
          groupCategoryAudience?: ServerTypes.AudienceEnum | null;
          bio?: string | null;
          groupCategory?: {
            id?: any | null;
            title?: string | null;
            groupCategoryType?: ServerTypes.GroupCategoryTypeEnum | null;
          } | null;
          place?: {
            id?: any | null;
            description?: string | null;
            mainText?: string | null;
            secondaryText?: string | null;
          } | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};
type GetUserQueryVariables = { filter?: GenericFilterRequestUserInputType };

export const GetUserQuery = gql`
  query ($filter: GenericFilterRequestUserInputType!) {
    getUser(filter: $filter) {
      isSuccess
      messagingKey
      listDto {
        count
        items {
          completeProfilePercentage
          completeQar
          userType
          accountPrivacy
          personDto {
            id
            firstName
            lastName
            fullName
            phoneNumber
            email
            coverUrl
            avatarUrl
            headline
            birthday
            gender
            currnetCity {
              id
              personId
              cityId
              locationType
              audience
              city {
                id
                name
                placeId
              }
            }
            hometown {
              id
              personId
              cityId
              locationType
              audience
              city {
                id
                name
                placeId
              }
            }
            relationship {
              personId
              audience
              relationshipStatus {
                id
                title
              }
            }
            personCurrentExperiences {
              id
              title
              description
              employmentType
              audience
              startDate
              endDate
              stillWorkingThere
              companyId
              companyDto {
                id
                title
                logoUrl
              }
              cityDto {
                id
                name
                placeId
                countryId
              }
              dateDiff {
                years
                months
                days
              }
              mediaUrl
            }
            experience {
              id
              title
              description
              employmentType
              audience
              startDate
              endDate
              stillWorkingThere
              companyId
              companyDto {
                id
                title
                logoUrl
              }
              cityDto {
                id
                name
                placeId
              }
              dateDiff {
                years
                months
                days
              }
              mediaUrl
            }
            personSchools {
              id
              year
              school {
                id
                title
              }
              audience
            }
            personUniversities {
              id
              personDto {
                id
              }
              collegeDto {
                id
                instituteType
                name
                alphaTwoCode
                country
                stateProvince
                webSiteUrl1
                webSiteUrl2
              }
            }
          }
          organizationUserDto {
            id
            organizationUserType
            groupCategoryId
            groupCategory {
              id
              title
              groupCategoryType
            }
            placeId
            place {
              id
              description
              mainText
              secondaryText
            }
            avatarUrl
            coverUrl
            fullName
            joinDateTime
            joinAudience
            establishmentDate
            joinAudience
            sizeAudience
            establishmentDateAudience
            groupCategoryAudience
            bio
          }
        }
      }
    }
  }
`;

export async function getUserQuery() {
  const response = await Profile.request<GetUserQuery, GetUserQueryVariables>(GetUserQuery, { filter: {} });
  const user =
    response?.getUser?.listDto?.items?.[0]?.personDto || response?.getUser?.listDto?.items?.[0]?.organizationUserDto;

  return {
    ...user,
    userType: response?.getUser?.listDto?.items?.[0]?.userType,
    completeProfilePercentage: response?.getUser?.listDto?.items?.[0]?.completeProfilePercentage,
    completeQar: response?.getUser?.listDto?.items?.[0]?.completeQar,
    accountPrivacy: response?.getUser?.listDto?.items?.[0]?.accountPrivacy,
  };
}
