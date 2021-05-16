import axios from 'axios';
import { CsrfNames } from '../consts/CsrfNames';
import Keyword from '../models/Keyword';

export const Api = axios.create({
  xsrfCookieName: CsrfNames.csrfCookie,
  xsrfHeaderName: CsrfNames.csrfHeader
});

export interface ThesisRequestData {
  title: string,
  abstract: string,
  keywords: Keyword[],
  authorUsosIds: string[],
  reviewerUsosId: string,
}

export default Api;