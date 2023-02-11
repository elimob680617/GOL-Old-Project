import { Box, Button, CircularProgress, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { Add, CloseCircle, Edit2 } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PersonEmailType } from 'src/@types/sections/profile/userEmails';
import { UserPhoneNumberType } from 'src/@types/sections/profile/userPhoneNumber';
import { PersonSocialMediaType } from 'src/@types/sections/profile/userSocialMedia';
import { PersonWebSiteType } from 'src/@types/sections/profile/userWebsite';
import { AudienceEnum, VerificationStatusEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { addedEmail } from 'src/redux/slices/profile/contactInfo-slice-eli';
import { addedSocialMedia } from 'src/redux/slices/profile/socialMedia-slice';
import { phoneNumberAdded } from 'src/redux/slices/profile/userPhoneNumber-slice';
import { websiteAdded } from 'src/redux/slices/profile/userWebsite-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useLazyGetUserEmailsQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserEmails.generated';
import { useLazyGetUserPhoneNumbersQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserPhoneNumbers.generated';
import { useLazyGetUserSocialMediasQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserSocialMedias.generated';
import { useLazyGetUserWebSitesQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserWebSites.generated';

export default function NGOContactInfoMainDialog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { initialize } = useAuth();

  const [getUserEmails, { data: emailData, isFetching: isFetchingEmail }] = useLazyGetUserEmailsQuery();

  const [getUserPhoneNumbers, { data: phoneNumberData, isFetching: isFetchingPhoneNumber }] =
    useLazyGetUserPhoneNumbersQuery();

  const [getUserSocialMedias, { data: socialMediaData, isFetching: isFetchingSocialMedia }] =
    useLazyGetUserSocialMediasQuery();

  const [getUserWebSites, { data: websitesData, isFetching: isFetchingWebsite }] = useLazyGetUserWebSitesQuery();

  useEffect(() => {
    getUserEmails({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
    getUserPhoneNumbers({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
    getUserSocialMedias({ filter: { dto: { id: null } } });
    getUserWebSites({ filter: { all: true } });
  }, [getUserEmails, getUserPhoneNumbers, getUserSocialMedias, getUserWebSites]);

  const handleEditEmail = (email: PersonEmailType) => {
    dispatch(
      addedEmail({
        id: email.id,
        audience: email.audience,
        email: email.email,
        status: email.status,
      })
    );

    router.push(PATH_APP.profile.ngo.contactInfo.email.root);
  };

  const handleEditPhoneNumber = (number: UserPhoneNumberType) => {
    dispatch(
      phoneNumberAdded({
        id: number.id,
        userId: number.userId,
        phoneNumber: number.phoneNumber,
        status: number.status,
        audience: number.audience,
        verificationCode: number.verificationCode,
      })
    );
    router.push(PATH_APP.profile.ngo.contactInfo.phoneNumber.edit);
  };

  const handleEditSocialLick = (socialLink: PersonSocialMediaType) => {
    dispatch(
      addedSocialMedia({
        id: socialLink.id,
        audience: socialLink.audience,
        userName: socialLink.userName,
        socialMediaDto: socialLink.socialMediaDto,
      })
    );

    router.push(PATH_APP.profile.ngo.contactInfo.socialLink.root);
  };

  const handleEditWebsite = (website: PersonWebSiteType) => {
    dispatch(
      websiteAdded({
        id: website.id,
        userId: website.userId,
        audience: website.audience,
        webSiteUrl: website.webSiteUrl,
      })
    );
    router.push(PATH_APP.profile.ngo.contactInfo.website.edit);
  };

  const handleRoutingPhoneNumber = (number: UserPhoneNumberType) => {
    dispatch(phoneNumberAdded(number));
    router.push(PATH_APP.profile.ngo.contactInfo.phoneNumber.root);
  };

  const handleRoutingWebsite = (website: PersonWebSiteType) => {
    dispatch(websiteAdded(website));
    router.push(PATH_APP.profile.ngo.contactInfo.website.root);
  };

  const handleRoutingEmail = (email: PersonEmailType) => {
    dispatch(addedEmail(email));
    router.push(PATH_APP.profile.ngo.contactInfo.email.root);
  };

  const handleRoutingSocialMedia = (socialLink: PersonSocialMediaType) => {
    dispatch(addedSocialMedia(socialLink));
    router.push(PATH_APP.profile.ngo.contactInfo.socialLink.root);
  };

  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizard') === 'true';
    const fromHomePage = localStorage.getItem('fromHomePage') === 'true';
    if (fromWizard) {
      initialize();
      localStorage.removeItem('fromWizard');
      if (fromHomePage) {
        router.push(PATH_APP.home.wizard.wizardList);
      } else {
        router.push(PATH_APP.profile.ngo.wizard.wizardList);
      }
    } else {
      router.push(PATH_APP.profile.ngo.root);
    }
  }

  return (
    <>
      <Dialog fullWidth={true} open={true} keepMounted onClose={handleClose}>
        <Stack spacing={2} sx={{ py: 3, minHeight: 320 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Contact Info
            </Typography>
            <IconButton onClick={handleClose}>
              <Icon name="Close-1" />
            </IconButton>
          </Stack>
          <Divider />

          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle2" color="text.primary">
              Email
            </Typography>

            {isFetchingEmail ? (
              <CircularProgress size={20} />
            ) : (
              emailData?.getUserEmails?.listDto?.items?.map((email) => (
                <Typography variant="body2" color="text.primary" key={email?.id}>
                  {email?.email}
                  <IconButton sx={{ mr: 1 }} onClick={() => handleEditEmail(email as PersonEmailType)}>
                    <Icon name="Edit-Pen" color="text.primary" />
                  </IconButton>
                </Typography>
              ))
            )}

            {emailData?.getUserEmails?.listDto?.items && emailData?.getUserEmails?.listDto?.items?.length < 3 && (
              <Button
                variant="outlined"
                sx={{ height: '40px', color: 'text.primary' }}
                onClick={() => handleRoutingEmail({ audience: AudienceEnum.Public })}
              >
                <Icon name="Plus" color="text.primary" />
                <Typography>Add Email</Typography>
              </Button>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle2" color="text.primary">
              Phone Number
            </Typography>

            {isFetchingPhoneNumber ? (
              <CircularProgress size={22} />
            ) : (
              phoneNumberData?.getUserPhoneNumbers?.listDto?.items?.map((number) => (
                <Typography variant="body2" color="text.primary" key={number?.id}>
                  {number?.phoneNumber}
                  <IconButton sx={{ mr: 1 }} onClick={() => handleEditPhoneNumber(number as UserPhoneNumberType)}>
                    <Icon name="Edit-Pen" color="text.primary" />
                  </IconButton>
                </Typography>
              ))
            )}
            {phoneNumberData?.getUserPhoneNumbers?.listDto?.items &&
              phoneNumberData?.getUserPhoneNumbers?.listDto?.items?.length < 3 && (
                <Button
                  variant="outlined"
                  sx={{ height: '40px', color: 'text.primary' }}
                  onClick={() => handleRoutingPhoneNumber({ audience: AudienceEnum.Public })}
                >
                  <Icon name="Plus" color="text.primary" />
                  <Typography>Add Phone Number</Typography>
                </Button>
              )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle2" color="text.primary">
              Social Link
            </Typography>

            {isFetchingSocialMedia ? (
              <CircularProgress size={20} />
            ) : (
              socialMediaData?.getUserSocialMedias?.listDto?.items?.map((socialLink) => (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center' }} key={socialLink?.id}>
                    <Typography variant="body2" color="text.secondary" key={socialLink?.id} sx={{ ml: 1 }}>
                      {socialLink?.socialMediaDto?.title}:
                    </Typography>
                    <Typography variant="body2" color="text.primary" key={socialLink?.id} sx={{ ml: 1 }}>
                      {socialLink?.userName}
                    </Typography>
                    <IconButton
                      sx={{ mr: 1 }}
                      onClick={() => handleEditSocialLick(socialLink as PersonSocialMediaType)}
                    >
                      <Icon name="Edit-Pen" color="text.primary" />
                    </IconButton>
                  </Box>
                </>
              ))
            )}

            {socialMediaData?.getUserSocialMedias?.listDto?.items &&
              socialMediaData?.getUserSocialMedias?.listDto?.items?.length < 10 && (
                <Button
                  startIcon={<Icon name="Plus" color="text.primary" />}
                  variant="outlined"
                  sx={{ height: '40px', color: 'text.primary' }}
                  onClick={() => handleRoutingSocialMedia({ audience: AudienceEnum.Public })}
                >
                  <Typography>Add Social Link</Typography>
                </Button>
              )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle2" color="text.primary">
              Website
            </Typography>
            {isFetchingWebsite ? (
              <CircularProgress size={22} />
            ) : (
              websitesData?.getUserWebSites?.listDto?.items?.map((website) => (
                <Typography variant="body2" color="text.primary" key={website?.id}>
                  {website?.webSiteUrl}
                  <IconButton sx={{ mr: 1 }} onClick={() => handleEditWebsite(website as PersonWebSiteType)}>
                    <Icon name="Edit-Pen" color="text.primary" />
                  </IconButton>
                </Typography>
              ))
            )}
            {websitesData?.getUserWebSites?.listDto?.items &&
              websitesData?.getUserWebSites?.listDto?.items?.length < 3 && (
                <Button
                  variant="outlined"
                  sx={{ height: '40px', color: 'text.primary' }}
                  onClick={() => handleRoutingWebsite({ audience: AudienceEnum.Public })}
                >
                  <Icon name="Plus" color="text.primary" />
                  <Typography>Add Website</Typography>
                </Button>
              )}
          </Stack>
          <Divider />
        </Stack>
      </Dialog>
    </>
  );
}
