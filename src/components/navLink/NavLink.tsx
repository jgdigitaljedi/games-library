import React, { FunctionComponent } from 'react';
import { Link, RouteComponentProps } from '@reach/router';
import colors from '../../style/colors';

const NavLink: FunctionComponent = (props: RouteComponentProps) => {
  /* tslint:disable */
  return (
    <Link
      {...props}
      to="/"
      getProps={({ isCurrent }) => {
        return { style: { color: isCurrent ? colors.warn : undefined } };
      }}
    />
  );
};

export default NavLink;
/* tslint:enable */
