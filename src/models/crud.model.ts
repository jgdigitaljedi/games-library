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
  headers: {
    headers: {
      [key: string]: string | null;
    };
  };
  url: string;
}
