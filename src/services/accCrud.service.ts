import Axios, { AxiosResponse } from 'axios';
import { getRequestKey } from './auth.service';
import { makeRequest } from './generalCrud.service';
import { IAcc } from '@/models/accessories.model';

const endpoint = 'acc';

export const saveAcc = async (acc: IAcc, isUpdate?: boolean): Promise<AxiosResponse | any> => {
  const hasKey = !!getRequestKey();
  console.log('acc to be updated', acc);
  if (isUpdate && hasKey) {
    const params = makeRequest(endpoint, acc._id);
    const result = await Axios.patch(params.url, { acc }, params.headers);
    return result;
  } else if (hasKey) {
    const params = makeRequest(endpoint);
    console.log('param', params);
    console.log('acc', acc);
    const result = await Axios.put(params.url, { acc }, params.headers);
    return result;
  } else {
    return {
      error: true,
      message: 'You must be logged in to do that!'
    };
  }
};
