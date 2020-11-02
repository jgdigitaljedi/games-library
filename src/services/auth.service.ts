import Axios from 'axios';
import { AUTH_KEY_LOCAL_STORAGE } from '../constants';
import { IAuthCreds, ILoginResult } from '../models/crud.model';

export const loginToServer = async (creds: IAuthCreds) => {
  const url = `${window.urlPrefix}/api/vg/auth`;
  const result: ILoginResult = await Axios.post(url, creds);
  return result;
};

export const getRequestKey = (): string | null => {
  return localStorage.getItem(AUTH_KEY_LOCAL_STORAGE);
};

export const getRequestHeaders = () => {
  return {
    headers: {
      Authorization: getRequestKey()
    }
  };
};
