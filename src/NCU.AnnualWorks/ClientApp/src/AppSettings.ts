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
      Current: process.env.REACT_APP_API_TERMS_CURRENT!,
      All: process.env.REACT_APP_API_TERMS_ALL!
    },
    Users: {
      Base: process.env.REACT_APP_API_USERS_BASE!,
      Students: process.env.REACT_APP_API_USERS_STUDENTS!,
      Employees: process.env.REACT_APP_API_USERS_EMPLOYEES!,
      Custom: process.env.REACT_APP_API_USERS_CUSTOM!,
      Admins: {
        Base: process.env.REACT_APP_API_USERS_ADMINS!,
        Default: process.env.REACT_APP_API_USERS_ADMINS_DEFAULT!,
      },
      All: process.env.REACT_APP_API_USERS_ALL!
    },
    Theses: {
      Base: process.env.REACT_APP_API_THESES!,
      Promoted: process.env.REACT_APP_API_THESES_PROMOTED!,
      Reviewed: process.env.REACT_APP_API_THESES_REVIEWED!,
      Authored: process.env.REACT_APP_API_THESES_AUTHORED!,
      Grade: process.env.REACT_APP_API_THESES_GRADE!,
      Hide: process.env.REACT_APP_API_THESES_HIDE!,
      Unhide: process.env.REACT_APP_API_THESES_UNHIDE!,
      Search: process.env.REACT_APP_API_THESES_SEARCH!
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
    },
    Deadline: {
      Base: process.env.REACT_APP_API_DEADLINE!
    },
    Course: {
      Base: process.env.REACT_APP_API_COURSE!
    },
    Export: {
      Base: process.env.REACT_APP_API_EXPORT!,
      Validate: process.env.REACT_APP_API_EXPORT_VALIDATE!,
    }
  }
  export const Copyright = process.env.REACT_APP_COPYRIGHT!;
}