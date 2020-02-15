import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { IGame } from '../../../common.model';

interface IProps extends RouteComponentProps {
  data: IGame[];
}

const SortBar: FunctionComponent<IProps> = (props: IProps) => {
  return <section className="sortbar"></section>;
};

export default SortBar;
