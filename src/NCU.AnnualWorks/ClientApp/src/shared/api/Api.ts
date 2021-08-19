import axios from 'axios';
import { CsrfNames } from '../Consts';
import { Keyword, Grade } from '../Models';


export const Api = axios.create({
  xsrfCookieName: CsrfNames.csrfCookie,
  xsrfHeaderName: CsrfNames.csrfHeader
});

Api.interceptors.response.use(response => response, error => {
  //debugger;
  switch (error.response.status) {
    case 401:
      throw new Error("401 - Unauthorized");
    case 403:
      throw new Error("403 - Forbidden");
    case 404:
      throw new Error("404 - Not found");
    case 500:
      throw new Error("500 - Internal Server Error");
  }
});
export interface ThesisRequestData {
  title: string,
  abstract: string,
  keywords: Keyword[],
  authorUsosIds: string[],
  reviewerUsosId: string,
};

export interface ReviewRequestData {
  thesisGuid: string,
  qnAs: Record<number, string>,
  grade: Grade,
  isConfirmed: boolean,
}

export interface ConfirmGradeRequestData {
  grade: string
}

export interface SetDeadlineRequestData {
  deadline: string
}

export interface SetCourseRequestData {
  courseCode: string
}

export interface SetAdminsRequestData {
  userIds: string[]
}

export interface SetCustomUsersRequestData {
  userIds: string[]
}