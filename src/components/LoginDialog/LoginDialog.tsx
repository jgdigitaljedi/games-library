import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { FunctionComponent, SyntheticEvent, useState } from 'react';
import { ILoginResult } from '../../models/crud.model';
import { loginToServer } from '../../services/auth.service';
import './LoginDialog.scss';

interface IProps {
  authKeyChange: (key: ILoginResult) => void;
}

const LoginDialog: FunctionComponent<IProps> = ({ authKeyChange }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const loginCall = async () => {
    const result: ILoginResult = await loginToServer({ username, password });
    authKeyChange(result);
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
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              loginCall();
            }
          }}
          onChange={(e: SyntheticEvent) => {
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
