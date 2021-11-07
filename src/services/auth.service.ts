import Axios, { AxiosRequestHeaders } from 'axios';
import { AUTH_KEY_LOCAL_STORAGE } from '@/constants';
import { IAuthCreds, ILoginResult } from '@/models/crud.model';

export interface HeaderObj {
  headers: AxiosRequestHeaders;
}

export const loginToServer = async (creds: IAuthCreds) => {
  const url = `${window.urlPrefix}/api/vg/auth`;
  try {
    const result: ILoginResult = await Axios.post(url, creds);
    return result;
  } catch (error) {
    return Promise.resolve({
      data: { error: true, message: 'Username or password is invalid!', key: '' }
    });
  }
};

export const getRequestKey = (): string => {
  return localStorage.getItem(AUTH_KEY_LOCAL_STORAGE) || '';
};

export const getRequestHeaders = (): HeaderObj => {
  return {
    headers: {
      Authorization: getRequestKey()
    }
  };
};
