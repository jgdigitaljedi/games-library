import { HeaderObj } from '@/services/auth.service';

export interface IAuthCreds {
  username: string;
  password: string;
}

export interface ILoginResult {
  data: {
    error: boolean;
    message: string;
    key: string;
  };
}

export interface IRequestParams {
  // headers: {
  //   headers: {
  //     [key: string]: string;
  //   };
  // };
  headers: HeaderObj;
  url: string;
}
