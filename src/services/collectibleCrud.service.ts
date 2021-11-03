import { ICollectible } from '@/models/collectibles.model';
import Axios, { AxiosError, AxiosResponse } from 'axios';
import { getRequestKey } from './auth.service';
import { makeRequest } from './generalCrud.service';

const endpoint = 'collectibles';

export const saveCollectible = async (
  collectible: ICollectible,
  isUpdate?: boolean
): Promise<AxiosResponse | AxiosError | any> => {
  const hasKey = !!getRequestKey();
  if (isUpdate && hasKey) {
    const params = makeRequest(endpoint, collectible._id);
    const result = await Axios.patch(params.url, { collectible }, params.headers);
    return result;
  } else if (hasKey) {
    const params = makeRequest(endpoint);
    const result = await Axios.put(params.url, { collectible }, params.headers);
    return result;
  } else {
    return {
      error: true,
      message: 'You must be logged in to do that!'
    };
  }
};
