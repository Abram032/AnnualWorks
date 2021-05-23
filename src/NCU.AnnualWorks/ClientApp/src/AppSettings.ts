export namespace AppSettings {
  export const Urls = {
    UMK: process.env.REACT_APP_URLS_UMK!,
    USOS: process.env.REACT_APP_URLS_USOS!,
    InstituteOfPsychology: process.env.REACT_APP_URLS_INSTITUTE_OF_PSYCHOLOGY!,
  };
  export const API = {
    Auth: {
      Authenticate: process.env.REACT_APP_API_AUTH_AUTHENTICATE!,
      Authorize: process.env.REACT_APP_API_AUTH_AUTHORIZE!,
      SignOut: process.env.REACT_APP_API_AUTH_SIGN_OUT!
    },
    Keywords: {
      Base: process.env.REACT_APP_API_KEYWORDS!
    },
    Terms: {
      Base: process.env.REACT_APP_API_TERMS!,
      Current: process.env.REACT_APP_API_TERMS_CURRENT!
    },
    Users: {
      Students: process.env.REACT_APP_API_USERS_STUDENTS!,
      Employees: process.env.REACT_APP_API_USERS_EMPLOYEES!,
      Admins: process.env.REACT_APP_API_USERS_ADMINS!,
    },
    Theses: {
      Base: process.env.REACT_APP_API_THESES!,
      Promoted: process.env.REACT_APP_API_THESES_PROMOTED!,
      Reviewed: process.env.REACT_APP_API_THESES_REVIEWED!,
      Authored: process.env.REACT_APP_API_THESES_AUTHORED!,
    },
    Questions: {
      Base: process.env.REACT_APP_API_QUESTIONS!,
      Active: process.env.REACT_APP_API_QUESTIONS_ACTIVE!,
    },
    Reviews: {
      Base: process.env.REACT_APP_API_REVIEWS!
    },
    Files: {
      Base: process.env.REACT_APP_API_FILES!
    }
  }
  export const Copyright = process.env.REACT_APP_COPYRIGHT!;
}