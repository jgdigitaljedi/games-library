import React, { FunctionComponent } from 'react';
import { IConsole } from '../../../common.model';

interface IProps {
  platform: IConsole;
  saveClicked: Function;
}

const PlatformForm: FunctionComponent<IProps> = ({ platform }: IProps) => {
  return (
    <div className="crud-form platform-form">
      <div>Platform Form</div>
    </div>
  );
};

export default PlatformForm;
