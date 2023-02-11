// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}
function prefixRoutesProfile() {
  if (typeof window !== 'undefined') {
    const route = localStorage.getItem('homePageWizard') === 'true' ? '' : 'profile/user/';
    return route;
  } else return 'profile/user/';
}

function prefixRoutesNGOProfile() {
  if (typeof window !== 'undefined') {
    const route = localStorage.getItem('homePageWizard') === 'true' ? '' : 'profile/ngo/';
    return route;
  } else return 'profile/ngo/';
}

const ROOTS_AUTH = '/auth';
const ROOTS_APP = '/';
const ROOTS_SEARCH = '/search';
const ROOTS_CAMPAIGNPOST_LANDING = '/post/campaign-post/landing';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  signIn: path(ROOTS_AUTH, '/sign-in'),
  signUp: {
    root: path(ROOTS_AUTH, '/sign-up'),
    typeSelection: path(ROOTS_AUTH, '/sign-up/type-selection'),
    basicInfo: path(ROOTS_AUTH, '/sign-up/basic-info'),
    advancedInfo: path(ROOTS_AUTH, '/sign-up/advanced-info'),
    verification: path(ROOTS_AUTH, '/sign-up/verification'),
    successSignUp: path(ROOTS_AUTH, '/sign-up/success-signup'),
  },
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  forgetPassword: path(ROOTS_AUTH, '/forget-password'),
  confirmForgetPassword: path(ROOTS_AUTH, '/confirmation-forget-password'),
  verify: path(ROOTS_AUTH, '/verify'),
  successResetPassword: path(ROOTS_AUTH, '/success-reset-password'),
};

export const generatePathApp = () => ({
  root: ROOTS_APP,
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page404: '/404',
  page500: '/500',
  chat: {
    root: path(ROOTS_APP, '/chat'),
    new: path(ROOTS_APP, '/chat/new'),
    conversation: path(ROOTS_APP, '/chat/:conversationKey'),
  },
  connections: {
    root: path(ROOTS_APP, '/connections'),
  },
  search: {
    root: path(ROOTS_SEARCH, ''),
    all: path(ROOTS_SEARCH, '/All'),
    people: path(ROOTS_SEARCH, '/People'),
    ngo: path(ROOTS_SEARCH, '/Ngo'),
    post: path(ROOTS_SEARCH, '/Post'),
    fundraising: path(ROOTS_SEARCH, '/Fundraising'),
    companies: path(ROOTS_SEARCH, '/Companies'),
    media: path(ROOTS_SEARCH, '/Media'),
    hashtag: path(ROOTS_SEARCH, '/Hashtags'),
  },
  home: {
    index: '/home',
    wizard: {
      wizardList: path(ROOTS_APP, '/wizard-list'),
    },
    afterRegister: {
      welcome: path(ROOTS_APP, '/welcome'),
      gender: path(ROOTS_APP, '/gender'),
      location: path(ROOTS_APP, '/location'),
      category: path(ROOTS_APP, '/categories'),
      connections: path(ROOTS_APP, '/suggest-people'),
      field: path(ROOTS_APP, '/fields'),
      reason: path(ROOTS_APP, '/reasons'),
      done: path(ROOTS_APP, '/done'),
    },
  },
  post: {
    moreMedia: '/more-media',
    viewPost: {
      PostDetails: '/post-details',
    },
    createPost: {
      socialPost: {
        index: '/create-social-post',
        addLocation: '/add-social-post-location',
        addGif: '/add-gif',
      },
      campainPost: {
        new: '/post/campaign-post/create/new',
        edit: '/post/campaign-post/create/edit',
        draft: '/post/campaign-post/create/draft',
      },
    },
    campaginPostLanding: path(ROOTS_CAMPAIGNPOST_LANDING, ''),
    report: {
      root: path(ROOTS_APP, '/post-report'),
      confirmation: path(ROOTS_APP, '/report-confirmation'),
      success: path(ROOTS_APP, '/report-success'),
      Block: path(ROOTS_APP, '/report-block'),
      Unfollow: path(ROOTS_APP, '/report-unfollow'),
    },
    postDetails: {
      index: path(ROOTS_APP, '/post/post-details'),
    },
    sharePost: {
      index: path(ROOTS_APP, '/share-post'),
      addLocation: path(ROOTS_APP, '/add-share-location'),
    },

    sendPost: {
      index: path(ROOTS_APP, '/send-post'),
      sendToConnections: path(ROOTS_APP, '/send-to-connections'),
    },
  },
  profile: {
    ngo: {
      root: path(ROOTS_APP, 'profile/ngo'),
      viewNgo: path(ROOTS_APP, 'profile/ngo/view'),
      bioDialog: path(ROOTS_APP, `${prefixRoutesNGOProfile()}bio-dialog`),
      mainProfileNChangePhotoAvatar: path(ROOTS_APP, `${prefixRoutesNGOProfile()}main-profile-ngo-change-avatar-photo`),
      mainProfileNChangePhotoCover: path(ROOTS_APP, `${prefixRoutesNGOProfile()}main-profile-ngo-change-cover-photo`),
      ngoEditAvatar: path(ROOTS_APP, `${prefixRoutesNGOProfile()}ngoEdit-avatar`),
      ngoEditCover: path(ROOTS_APP, `${prefixRoutesNGOProfile()}ngoEdit-cover`),
      ngoDeleteAvatar: path(ROOTS_APP, 'profile/ngo/main-profile-ngo-delete-avatar-dialog'),
      ngoDeleteCover: path(ROOTS_APP, 'profile/ngo/main-profile-ngo-delete-cover-dialog'),
      project: {
        list: path(ROOTS_APP, `${prefixRoutesNGOProfile()}project-list`),
        new: path(ROOTS_APP, `${prefixRoutesNGOProfile()}project-new`),
        startDate: path(ROOTS_APP, `${prefixRoutesNGOProfile()}project-start-date`),
        endDate: path(ROOTS_APP, `${prefixRoutesNGOProfile()}project-end-date`),
        location: path(ROOTS_APP, `${prefixRoutesNGOProfile()}project-location`),
        photo: path(ROOTS_APP, `${prefixRoutesNGOProfile()}project-photo`),
        editPhoto: path(ROOTS_APP, `${prefixRoutesNGOProfile()}project-edit-photo`),
        delete: path(ROOTS_APP, `${prefixRoutesNGOProfile()}project-delete`),
        discard: path(ROOTS_APP, `${prefixRoutesNGOProfile()}project-discard`),
        audience: path(ROOTS_APP, `${prefixRoutesNGOProfile()}project-audience`),
      },
      publicDetails: {
        main: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details`),
        // audience:path(ROOTS_APP,'profile/ngo/select-audience-main'),
        ngoCategory: {
          root: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-category`),
          audience: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-category-audience`),
          searchCategory: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-select-category`),
          editCategory: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-edit-category`),
          discardCategory: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-discard-category`),
          deleteCategory: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-delete-category`),
        },
        ngoSize: {
          root: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-size`),
          editSize: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-edit-size`),
          audience: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-size-audience`),
          selectSize: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-select-size`),
          deleteSize: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-delete-size`),
          discardSize: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-discard-size`),
        },
        ngoEstablishedDate: {
          root: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-establishment`),
          editDate: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-edit-establishment`),
          audience: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-establishment-audience`),
          selectDate: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-established-date`),
          deleteEstablishedDate: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-delete-established-date`),
          discardEstablsihedDate: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-discard-established-date`),
        },
        ngoPlace: {
          root: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-place`),
          editLocation: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-edit-place`),
          LocatedIn: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-located-in`),
          audience: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-place-audience`),
          deletePlace: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-delete-place`),
          discardPlace: path(ROOTS_APP, `${prefixRoutesNGOProfile()}public-details-discard-place`),
        },
      },
      contactInfo: {
        root: path(ROOTS_APP, `${prefixRoutesNGOProfile()}contact-info`),
        email: {
          root: path(ROOTS_APP, 'profile/ngo/email-form'),
          verify: path(ROOTS_APP, 'profile/ngo/verify-email'),
          confirm: path(ROOTS_APP, 'profile/ngo/confirm-password-form'),
          delete: path(ROOTS_APP, 'profile/ngo/email-delete-confirm'),
          discard: path(ROOTS_APP, 'profile/ngo/email-discard-saveChange'),
          audience: path(ROOTS_APP, 'profile/ngo/select-audience-email'),
        },
        phoneNumber: {
          root: path(ROOTS_APP, `${prefixRoutesNGOProfile()}add-phone-number`),
          edit: path(ROOTS_APP, `${prefixRoutesNGOProfile()}edit-phone-number`),
          verify: path(ROOTS_APP, `${prefixRoutesNGOProfile()}verify-phone-number`),
          confirm: path(ROOTS_APP, `${prefixRoutesNGOProfile()}confirm-password`),
          discard: path(ROOTS_APP, `${prefixRoutesNGOProfile()}discard-phone-number`),
          delete: path(ROOTS_APP, `${prefixRoutesNGOProfile()}confirm-delete-number`),
          audience: path(ROOTS_APP, `${prefixRoutesNGOProfile()}select-audience-phone-number`),
        },
        socialLink: {
          root: path(ROOTS_APP, 'profile/ngo/social-link-form'),
          platform: path(ROOTS_APP, 'profile/ngo/social-link-platform'),
          discard: path(ROOTS_APP, 'profile/ngo/socialLink-discard-saveChange'),
          delete: path(ROOTS_APP, 'profile/ngo/social-link-delete-confirm'),
          audience: path(ROOTS_APP, 'profile/ngo/select-audience-socialMedia'),
        },
        website: {
          root: path(ROOTS_APP, `${prefixRoutesNGOProfile()}add-website`),
          edit: path(ROOTS_APP, `${prefixRoutesNGOProfile()}edit-website`),
          discard: path(ROOTS_APP, `${prefixRoutesNGOProfile()}discard-website`),
          delete: path(ROOTS_APP, `${prefixRoutesNGOProfile()}confirm-delete-website`),
          audience: path(ROOTS_APP, `${prefixRoutesNGOProfile()}select-audience-website`),
        },
      },
      certificate: {
        root: path(ROOTS_APP, `${prefixRoutesNGOProfile()}certificate-list`),
        add: path(ROOTS_APP, `${prefixRoutesNGOProfile()}update-certificate`),
        searchName: path(ROOTS_APP, `${prefixRoutesNGOProfile()}search-certificate-name`),
        issueOrganizationName: path(ROOTS_APP, `${prefixRoutesNGOProfile()}search-issuing-organization`),
        issueDate: path(ROOTS_APP, `${prefixRoutesNGOProfile()}certificate-issue-date`),
        expirationDate: path(ROOTS_APP, `${prefixRoutesNGOProfile()}certificate-expiration-date`),
        delete: path(ROOTS_APP, `${prefixRoutesNGOProfile()}certificate-delete-confirm`),
        discard: path(ROOTS_APP, `${prefixRoutesNGOProfile()}discard-certificate`),
        audience: path(ROOTS_APP, `${prefixRoutesNGOProfile()}select-audience-certificate`),
      },
      wizard: {
        wizardList: path(ROOTS_APP, `${prefixRoutesNGOProfile()}ngo-wizard-list`),
      },
    },
    user: {
      root: path(ROOTS_APP, 'profile/user'),
      userEdit: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit`),
      mainProfileNChangePhotoAvatar: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-change-photo-avatar`),
      mainProfileNChangePhotoCover: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-change-photo-cover`),
      userEditCover: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-cover`),
      userEditAvatar: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-avatar`),
      userEditDiscard: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-save-change`),
      birthday: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-birthday`),
      gender: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-gender`),
      // Components Related To Wizard
      mainProfileChangeAvatarUser: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-change-avatar`),
      mainProfileChangeCoverUser: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-change-cover`),
      mainProfileDeleteAvatar: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-delete-avatar`),
      mainProfileDeleteCover: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-delete-cover`),
      mainProfileAddAvatarUser: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-add-avatar`),
      mainProfileAddCoverUser: path(ROOTS_APP, `${prefixRoutesProfile()}userEdit-add-cover`),
      // userDeleteCover: path(ROOTS_APP, 'profile/user/main-profile-user-delete-cover-dialog'),
      certificate: {
        root: path(ROOTS_APP, 'profile/user/certificate-list'),
        add: path(ROOTS_APP, 'profile/user/add-certificate'),
        searchName: path(ROOTS_APP, 'profile/user/search-certificate-name'),
        issueOrganizationName: path(ROOTS_APP, 'profile/user/search-issuing-organization'),
        issueDate: path(ROOTS_APP, 'profile/user/certificate-issue-date'),
        expirationDate: path(ROOTS_APP, 'profile/user/certificate-expiration-date'),
        delete: path(ROOTS_APP, 'profile/user/certificate-delete-confirm'),
        discard: path(ROOTS_APP, 'profile/user/discard-certificate'),
        audience: path(ROOTS_APP, 'profile/user/select-audience-certificate'),
      },
      contactInfo: {
        root: path(ROOTS_APP, 'profile/user/contact-info'),
        email: {
          root: path(ROOTS_APP, 'profile/user/email-form'),
          verify: path(ROOTS_APP, 'profile/user/verify-email'),
          confirm: path(ROOTS_APP, 'profile/user/confirm-password-form'),
          delete: path(ROOTS_APP, 'profile/user/email-delete-confirm'),
          discard: path(ROOTS_APP, 'profile/user/email-discard-saveChange'),
          audience: path(ROOTS_APP, 'profile/user/select-audience-email'),
        },
        phoneNumber: {
          root: path(ROOTS_APP, 'profile/user/add-phone-number'),
          edit: path(ROOTS_APP, 'profile/user/edit-phone-number'),
          verify: path(ROOTS_APP, 'profile/user/verify-phone-number'),
          confirm: path(ROOTS_APP, 'profile/user/confirm-password'),
          discard: path(ROOTS_APP, 'profile/user/discard-phone-number'),
          delete: path(ROOTS_APP, 'profile/user/confirm-delete-number'),
          audience: path(ROOTS_APP, 'profile/user/select-audience-phone-number'),
        },
        socialLink: {
          root: path(ROOTS_APP, 'profile/user/social-link-form'),
          platform: path(ROOTS_APP, 'profile/user/social-link-platform'),
          discard: path(ROOTS_APP, 'profile/user/socialLink-discard-saveChange'),
          delete: path(ROOTS_APP, 'profile/user/social-link-delete-confirm'),
          audience: path(ROOTS_APP, 'profile/user/select-audience-socialMedia'),
        },
        website: {
          root: path(ROOTS_APP, 'profile/user/add-website'),
          edit: path(ROOTS_APP, 'profile/user/edit-website'),
          discard: path(ROOTS_APP, 'profile/user/discard-website'),
          delete: path(ROOTS_APP, 'profile/user/confirm-delete-website'),
          audience: path(ROOTS_APP, 'profile/user/select-audience-website'),
        },
      },
      skill: {
        root: path(ROOTS_APP, 'profile/user/skill-list'),
        searchSkill: path(ROOTS_APP, 'profile/user/search-skill'),
        endorsments: path(ROOTS_APP, 'profile/user/show-Endorsements'),
        delete: path(ROOTS_APP, 'profile/user/delete-skill'),
      },
      experience: {
        root: path(ROOTS_APP, `${prefixRoutesProfile()}experience-list`),
        add: path(ROOTS_APP, `${prefixRoutesProfile()}experience-new`),
        company: path(ROOTS_APP, `${prefixRoutesProfile()}experience-company`),
        location: path(ROOTS_APP, `${prefixRoutesProfile()}experience-location`),
        employmentType: path(ROOTS_APP, `${prefixRoutesProfile()}experience-employment-type`),
        photo: path(ROOTS_APP, `${prefixRoutesProfile()}experience-photo`),
        editPhoto: path(ROOTS_APP, `${prefixRoutesProfile()}experience-edit-photo`),
        startDate: path(ROOTS_APP, `${prefixRoutesProfile()}experience-start-date`),
        endDate: path(ROOTS_APP, `${prefixRoutesProfile()}experience-end-date`),
        delete: path(ROOTS_APP, `${prefixRoutesProfile()}experience-delete`),
        discard: path(ROOTS_APP, `${prefixRoutesProfile()}experience-discard`),
        audience: path(ROOTS_APP, `${prefixRoutesProfile()}experience-audience`),
      },
      publicDetails: {
        root: path(ROOTS_APP, `${prefixRoutesProfile()}public-details`),
        college: {
          add: path(ROOTS_APP, `${prefixRoutesProfile()}add-collage`),
          edit: path(ROOTS_APP, `${prefixRoutesProfile()}edit-college`),
          collegeName: path(ROOTS_APP, `${prefixRoutesProfile()}add-college-name`),
          concentrationName: path(ROOTS_APP, `${prefixRoutesProfile()}add-college-concenteration`),
          startDate: path(ROOTS_APP, `${prefixRoutesProfile()}college-start-date`),
          endDate: path(ROOTS_APP, `${prefixRoutesProfile()}college-end-date`),
          delete: path(ROOTS_APP, `${prefixRoutesProfile()}delete-college`),
          discard: path(ROOTS_APP, `${prefixRoutesProfile()}discard-college`),
          audience: path(ROOTS_APP, `${prefixRoutesProfile()}select-audience-college`),
        },
        university: {
          add: path(ROOTS_APP, `${prefixRoutesProfile()}add-university`),
          edit: path(ROOTS_APP, `${prefixRoutesProfile()}edit-university`),
          universityName: path(ROOTS_APP, `${prefixRoutesProfile()}add-university-name`),
          concentrationName: path(ROOTS_APP, `${prefixRoutesProfile()}add-university-concenteration`),
          startDate: path(ROOTS_APP, `${prefixRoutesProfile()}university-start-date`),
          endDate: path(ROOTS_APP, `${prefixRoutesProfile()}university-end-date`),
          delete: path(ROOTS_APP, `${prefixRoutesProfile()}delete-university`),
          discard: path(ROOTS_APP, `${prefixRoutesProfile()}discard-university`),
          audience: path(ROOTS_APP, `${prefixRoutesProfile()}select-audience-university`),
        },
        school: {
          add: path(ROOTS_APP, `${prefixRoutesProfile()}add-highSchool`),
          edit: path(ROOTS_APP, `${prefixRoutesProfile()}edit-highSchool`),
          schoolName: path(ROOTS_APP, `${prefixRoutesProfile()}add-highSchool-name`),
          year: path(ROOTS_APP, `${prefixRoutesProfile()}class-year`),
          delete: path(ROOTS_APP, `${prefixRoutesProfile()}delete-highSchool`),
          discard: path(ROOTS_APP, `${prefixRoutesProfile()}discard-highSchool`),
          audience: path(ROOTS_APP, `${prefixRoutesProfile()}select-audience-highSchool`),
        },
        currentCity: {
          add: path(ROOTS_APP, `${prefixRoutesProfile()}add-current-city`),
          edit: path(ROOTS_APP, `${prefixRoutesProfile()}edit-current-city`),
          currentCityName: path(ROOTS_APP, `${prefixRoutesProfile()}current-city`),
          delete: path(ROOTS_APP, `${prefixRoutesProfile()}confirm-delete-current-city`),
          discard: path(ROOTS_APP, `${prefixRoutesProfile()}close-dialog-current-city`),
          audience: path(ROOTS_APP, `${prefixRoutesProfile()}select-audience-current-city`),
        },
        relationship: {
          add: path(ROOTS_APP, '/profile/user/add-relationship'),
          edit: path(ROOTS_APP, '/profile/user/edit-relationship'),
          relationshipStatus: path(ROOTS_APP, '/profile/user/relationship-status'),
          delete: path(ROOTS_APP, '/profile/user/confirm-delete-relationship'),
          discard: path(ROOTS_APP, '/profile/user/close-dialog-relationship'),
          audience: path(ROOTS_APP, '/profile/user/select-audience-relationship'),
        },
        homeTown: {
          add: path(ROOTS_APP, `${prefixRoutesProfile()}add-home-town`),
          edit: path(ROOTS_APP, `${prefixRoutesProfile()}edit-home-town`),
          homeTownName: path(ROOTS_APP, `${prefixRoutesProfile()}home-town`),
          delete: path(ROOTS_APP, `${prefixRoutesProfile()}confirm-delete-home-town`),
          discard: path(ROOTS_APP, `${prefixRoutesProfile()}close-dialog-home-town`),
          audience: path(ROOTS_APP, `${prefixRoutesProfile()}select-audience-home-town`),
        },
      },
      view: { root: path(ROOTS_APP, '/profile/user/view') },
      wizard: {
        wizardList: path(ROOTS_APP, `${prefixRoutesProfile()}wizard-list`),
      },
    },
    post: {
      root: path(ROOTS_APP, '/profile/posts'),
    },
  },
});

export let PATH_APP = generatePathApp();

export const PathAppCaller = () => {
  setTimeout(() => {
    PathAppCaller();
  }, 100);
  PATH_APP = generatePathApp();
  return PATH_APP;
};
