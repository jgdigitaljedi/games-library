import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { ManageContextProvider } from './context/ManageContext';

const Manage: FunctionComponent<RouteComponentProps> = (props: RouteComponentProps<any>) => {
  return (
    <ManageContextProvider>
      <div className="mange-collection">Manage collection</div>
    </ManageContextProvider>
  );
};

export default Manage;
