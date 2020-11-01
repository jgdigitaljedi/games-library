import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { FunctionComponent, useState } from 'react';
import { AUTH_KEY_LOCAL_STORAGE } from '../../constants';
import { ILoginResult } from '../../models/common.model';
import { loginToServer } from '../../services/auth.service';
import './LoginDialog.scss';

interface IProps {
  authKeyChange: (key: string) => void;
}

const LoginDialog: FunctionComponent<IProps> = ({ authKeyChange }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const loginCall = async () => {
    const result: ILoginResult = await loginToServer({ username, password });
    console.log('result', result?.data);
    if (result.data.error) {
      localStorage.removeItem(AUTH_KEY_LOCAL_STORAGE);
      // @TODO: fix app.tsx so I can use notifications here
    } else {
      // @TODO: show success notification
      authKeyChange(result.data.key);
    }
  };

  return (
    <div className="login-dialog">
      <form>
        <InputText
          id="username"
          value={username}
          onChange={(e) => {
            // @ts-ignore
            setUsername(e.target.value);
          }}
          placeholder="Username"
        />
        <InputText
          id="password"
          value={password}
          onChange={(e) => {
            // @ts-ignore
            setPassword(e.target.value);
          }}
          placeholder="Password"
          type="password"
        />
        <Button
          label="Login"
          icon="pi pi-lock-open"
          iconPos="left"
          onClick={loginCall}
          type="button"
        />
      </form>
    </div>
  );
};

export default LoginDialog;
