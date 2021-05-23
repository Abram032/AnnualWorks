import axios, { AxiosInstance } from 'axios';
import { useHistory } from 'react-router';
import { CsrfNames } from '../consts/CsrfNames';
import { RouteNames } from '../consts/RouteNames';
import Keyword from '../models/Keyword';
import Review from '../models/Review';

export const useApi = (): AxiosInstance => {
  const history = useHistory();
  const api = axios.create({
    xsrfCookieName: CsrfNames.csrfCookie,
    xsrfHeaderName: CsrfNames.csrfHeader
  });

  api.interceptors.response.use(response => response, error => {
    switch(error.response.status) {
      case 400:
      case 409:
      case 500:
      case 401:
      case 403:
      case 404:
        throw error.response;
        //Only logging errors to show prompt to user.
        return;
      // case 401:
      //   return history.push(RouteNames.signIn);
      // case 403:
      //   return history.push(RouteNames.forbidden);
      // case 404:
      //   return history.push(RouteNames.notFound);
      default:
        return history.push(RouteNames.error);
    }
  });

  return api;
};
export interface ThesisRequestData {
  title: string,
  abstract: string,
  keywords: Keyword[],
  authorUsosIds: string[],
  reviewerUsosId: string,
};

export interface ReviewRequestData {
  thesisGuid: string,
  review: Review
}