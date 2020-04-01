import React, { FunctionComponent } from 'react';
import { IConsole } from '../../../common.model';

interface IProps {
  platform: IConsole;
  closeDialog: Function;
}

const PlatformForm: FunctionComponent<IProps> = ({ platform, closeDialog }: IProps) => {
  return (
    <div className="crud-form platform-form">
      <div>Platform Form</div>
    </div>
  );
};

export default PlatformForm;
