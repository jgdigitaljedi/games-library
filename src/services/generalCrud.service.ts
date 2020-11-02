import { IRequestParams } from '../models/crud.model';
import { getRequestHeaders } from './auth.service';

export const makeRequest = (endpoint: string, arg?: string): IRequestParams => {
  const url = `${window.urlPrefix}/api/vg/${endpoint}${arg ? `/${arg}` : ''}`;
  const headers = getRequestHeaders();
  return { headers, url };
};
