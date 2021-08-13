import { IRequestParams } from '@/models/crud.model';
import Axios, { AxiosResponse } from 'axios';
import { getRequestHeaders, getRequestKey } from './auth.service';

export const makeRequest = (endpoint: string, arg?: string): IRequestParams => {
  const url = `${window.urlPrefix}/api/vg/${endpoint}${arg ? `/${arg}` : ''}`;
  const headers = getRequestHeaders();
  return { headers, url };
};

export const getItems = async (): Promise<AxiosResponse | any> => {
  const hasKey = !!getRequestKey();
  if (hasKey) {
    const params = makeRequest('items');
    const result = await Axios.get(params.url, params.headers);
    return result;
  } else {
    return Promise.resolve({
      error: true,
      message: 'You must be logged in to fetch items from backend!'
    });
  }
};
