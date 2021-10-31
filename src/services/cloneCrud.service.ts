import { IClone } from '@/models/common.model';
import Axios, { AxiosResponse } from 'axios';
import { getRequestKey } from './auth.service';
import { makeRequest } from './generalCrud.service';

const endpoint = 'clones';

export const saveClone = async (clone: IClone, isUpdate?: boolean) => {
  const hasKey = !!getRequestKey();
  if (isUpdate && hasKey) {
    const params = makeRequest(endpoint, clone._id);
    const result = await Axios.patch(params.url, { clone }, params.headers);
    return result;
  } else if (hasKey) {
    const params = makeRequest(endpoint);
    const result = await Axios.put(params.url, { clone }, params.headers);
    return result;
  } else {
    return {
      error: true,
      message: 'You must be logged in to do that!'
    };
  }
};
