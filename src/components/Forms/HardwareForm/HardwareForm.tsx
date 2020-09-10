import React, { FunctionComponent } from 'react';
import { IHardware } from '../../../common.model';

interface IProps {
  hardware: IHardware;
  closeDialog: Function;
}

const HardwareForm: FunctionComponent<IProps> = ({ hardware, closeDialog }) => {
  return <></>;
};

export default HardwareForm;
