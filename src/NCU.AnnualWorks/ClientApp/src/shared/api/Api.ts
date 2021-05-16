import axios from 'axios';
import { CsrfNames } from '../consts/CsrfNames';

export const Api = axios.create({
  xsrfCookieName: CsrfNames.csrfCookie,
  xsrfHeaderName: CsrfNames.csrfHeader
});

export default Api;