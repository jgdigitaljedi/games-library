import React, { FunctionComponent } from 'react';
import { Link } from '@reach/router';

const Navbar: FunctionComponent = () => {
  return (
    <header className="navbar">
      <Link to="/">Home</Link>
      <Link to="/library">Library</Link>
      <Link to="/decider">Decider</Link>
      <Link to="/lists">Lists</Link>
    </header>
  );
};

export default Navbar;
