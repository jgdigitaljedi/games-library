import React, { FunctionComponent } from 'react';
import { ICollectible } from '../../../common.model';

interface IProps {
  collectible: ICollectible;
  closeDialog: Function;
}

const CollForm: FunctionComponent<IProps> = ({ collectible, closeDialog }) => {
  return <></>;
};

export default CollForm;
