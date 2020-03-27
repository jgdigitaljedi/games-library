import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { ManageContextProvider } from './context/ManageContext';
import ManageWhat from './components/ManageWhat/ManageWhat';

const Manage: FunctionComponent<RouteComponentProps> = (props: RouteComponentProps<any>) => {
  return (
    <ManageContextProvider>
      <div className="mange-collection">
        Manage collection
        <ManageWhat />
      </div>
    </ManageContextProvider>
  );
};

export default Manage;
