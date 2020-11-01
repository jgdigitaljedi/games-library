import Axios from 'axios';
import { IAuthCreds, ILoginResult } from '../models/common.model';

export const loginToServer = async (creds: IAuthCreds) => {
  const url = `${window.urlPrefix}/api/vg/auth`;
  const result: ILoginResult = await Axios.post(url, creds);
  return result;
};
