import { ReactNode } from 'react';
import ContactInfoMainDialog from 'src/sections/profile/user/owner/userContactInfo/ContactInfoMainDialog';
import ConfirmPasswordForm from 'src/sections/profile/user/owner/userContactInfo/userEmails/ConfirmPasswordForm';
import EmailDeleteDialog from 'src/sections/profile/user/owner/userContactInfo/userEmails/EmailDeleteDialog';
import EmailDiscardDialog from 'src/sections/profile/user/owner/userContactInfo/userEmails/EmailDiscardDialog';
import SelectAudienceDialog from 'src/sections/profile/user/owner/userContactInfo/userEmails/SelectAudienceDialog';
import UpsertPersonEmailForm from 'src/sections/profile/user/owner/userContactInfo/userEmails/UpsertPersonEmailForm';
import VerifyCodeFormEmail from 'src/sections/profile/user/owner/userContactInfo/userEmails/VerifyCodeForm';
import ConfirmDeletePhoneNumber from 'src/sections/profile/user/owner/userContactInfo/userPhoneNumber/ConfirmDeletePhoneNumber';
import ConfirmPassword from 'src/sections/profile/user/owner/userContactInfo/userPhoneNumber/ConfirmPassword';
import PhoneNumberDiscardDialog from 'src/sections/profile/user/owner/userContactInfo/userPhoneNumber/PhoneNumberDiscardDialog';
import SelectAudiencePhoneNumber from 'src/sections/profile/user/owner/userContactInfo/userPhoneNumber/SelectAudiencePhoneNumber';
// CONTACTINFO
import UpsertPhoneNumber from 'src/sections/profile/user/owner/userContactInfo/userPhoneNumber/UpsertPhoneNumber';
import VerifyCodeFormPhoneNumber from 'src/sections/profile/user/owner/userContactInfo/userPhoneNumber/VerifyCodeFormPhoneNumber';
import SelectAudienceSocialMediaDialog from 'src/sections/profile/user/owner/userContactInfo/userSocialLinks/SelectAudienceSocialMediaDialog';
import SocialLinkDeleteDialog from 'src/sections/profile/user/owner/userContactInfo/userSocialLinks/SocialLinkDeleteDialog';
import SocialLinkDiscardDialog from 'src/sections/profile/user/owner/userContactInfo/userSocialLinks/SocialLinkDiscardDialog';
import SocialLinkPlatformDialoge from 'src/sections/profile/user/owner/userContactInfo/userSocialLinks/SocialLinkPlatformDialoge';
import UpsertPersonSocialLinkForm from 'src/sections/profile/user/owner/userContactInfo/userSocialLinks/UpsertPersonSocialLinkForm';
import ConfirmDeleteWebsite from 'src/sections/profile/user/owner/userContactInfo/userWebsite/ConfirmDeleteWebsite';
import SelectAudienceWebsite from 'src/sections/profile/user/owner/userContactInfo/userWebsite/SelectAudienceWebsite';
import UpsertWebsite from 'src/sections/profile/user/owner/userContactInfo/userWebsite/UpsertWebsite';
import WebsiteDiscardDialog from 'src/sections/profile/user/owner/userContactInfo/userWebsite/WebsiteDiscardDialog';

const userContactInfoRoute: Record<string, ReactNode> = {
  'contact-info': <ContactInfoMainDialog />,
  // email
  'email-form': <UpsertPersonEmailForm />,
  'verify-email': <VerifyCodeFormEmail />,
  'confirm-password-form': <ConfirmPasswordForm />,
  'email-delete-confirm': <EmailDeleteDialog />,
  'email-discard-saveChange': <EmailDiscardDialog />,
  'select-audience-email': <SelectAudienceDialog />,
  // social
  'social-link-form': <UpsertPersonSocialLinkForm />,
  'social-link-platform': <SocialLinkPlatformDialoge />,
  'social-link-delete-confirm': <SocialLinkDeleteDialog />,
  'socialLink-discard-saveChange': <SocialLinkDiscardDialog />,
  'select-audience-socialMedia': <SelectAudienceSocialMediaDialog />,
  // phone
  'add-phone-number': <UpsertPhoneNumber />,
  'edit-phone-number': <UpsertPhoneNumber />,
  'confirm-delete-number': <ConfirmDeletePhoneNumber />,
  'discard-phone-number': <PhoneNumberDiscardDialog />,
  'select-audience-phone-number': <SelectAudiencePhoneNumber />,
  'verify-phone-number': <VerifyCodeFormPhoneNumber />,
  // website
  'add-website': <UpsertWebsite />,
  'edit-website': <UpsertWebsite />,
  'confirm-delete-website': <ConfirmDeleteWebsite />,
  'confirm-password': <ConfirmPassword />,
  'discard-website': <WebsiteDiscardDialog />,
  'select-audience-website': <SelectAudienceWebsite />,
};

export default userContactInfoRoute;
