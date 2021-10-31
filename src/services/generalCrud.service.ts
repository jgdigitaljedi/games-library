import { IItems } from '@/context/ItemsContext';
import { ViewWhatType } from '@/models/common.model';
import { IRequestParams } from '@/models/crud.model';
import Axios, { AxiosResponse } from 'axios';
import { getRequestHeaders, getRequestKey } from './auth.service';

interface EndpointTextObj {
  endpoint: string;
  errorText: string;
}

interface EndpointsAndText {
  games: EndpointTextObj;
  consoles: EndpointTextObj;
  accessories: EndpointTextObj;
  clones: EndpointTextObj;
  collectibles: EndpointTextObj;
  hardware: EndpointTextObj;
}

const endpointsAndErrorText: EndpointsAndText = {
  games: { endpoint: 'games', errorText: 'game' },
  consoles: { endpoint: 'consoles', errorText: 'platform' },
  accessories: { endpoint: 'acc', errorText: 'accessory' },
  clones: { endpoint: 'clones', errorText: 'clone console' },
  collectibles: { endpoint: 'collectibles', errorText: 'collectibles' },
  hardware: { endpoint: 'hardware', errorText: 'hardware' }
};

export const makeRequest = (endpoint: string, arg?: string): IRequestParams => {
  const url = `${window.urlPrefix}/api/vg/${endpoint}${arg ? `/${arg}` : ''}`;
  const headers = getRequestHeaders();
  return { headers, url };
};

export const getItems = async (): Promise<AxiosResponse<IItems> | any> => {
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

export const deleteItem = async (id: string, which: ViewWhatType) => {
  const hasKey = !!getRequestKey();
  const whichOptions = endpointsAndErrorText[which];
  if (hasKey && id) {
    const params = makeRequest(whichOptions.endpoint, id);
    const result = await Axios.delete(params.url, params.headers);
    return result;
  } else if (hasKey) {
    return {
      error: true,
      message: `Empty request: you must send a ${whichOptions.errorText} to delete.`
    };
  } else {
    return {
      error: true,
      message: 'You must be logged in to do that!'
    };
  }
};
