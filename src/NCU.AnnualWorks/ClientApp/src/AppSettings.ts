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
  }
  export const Copyright = process.env.REACT_APP_COPYRIGHT!;
}