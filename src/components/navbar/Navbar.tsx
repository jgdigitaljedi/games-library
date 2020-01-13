import React, { FunctionComponent, useState } from 'react';
import { Link } from '@reach/router';

const Navbar: FunctionComponent = () => {
  const [active, setActive] = useState('Home');
  return (
    <header className="navbar">
      <Link to="/" className={active === 'Home' ? 'active' : ''}>
        Home
      </Link>
      <Link to="/library" className={active === 'library' ? 'active' : ''}>
        Library
      </Link>
      <Link to="/decider" className={active === 'decider' ? 'active' : ''}>
        Decider
      </Link>
      <Link to="/lists" className={active === 'lists' ? 'active' : ''}>
        Lists
      </Link>
    </header>
  );
};

export default Navbar;
