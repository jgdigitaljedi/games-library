import React, { FunctionComponent, useState } from 'react';
import { Link } from '@reach/router';

const Navbar: FunctionComponent = () => {
  const [active, setActive] = useState('');

  function routeOnLoad() {
    const pn = window.location.pathname;
    let route = pn === '/' ? 'home' : pn.substr(1);
    setActive(route);
  }

  if (!active || !active.length) {
    routeOnLoad();
  }

  return (
    <header className="navbar">
      <Link to="/" className={active === 'home' ? 'active' : ''} onClick={() => setActive('home')}>
        Home
      </Link>
      <Link
        to="/library"
        className={active === 'library' ? 'active' : ''}
        onClick={() => setActive('library')}
      >
        Library
      </Link>
      <Link
        to="/decider"
        className={active === 'decider' ? 'active' : ''}
        onClick={() => setActive('decider')}
      >
        Decider
      </Link>
      <Link
        to="/lists"
        className={active === 'lists' ? 'active' : ''}
        onClick={() => setActive('lists')}
      >
        Lists
      </Link>
      <Link to="/viz" className={active === 'viz' ? 'active' : ''} onClick={() => setActive('viz')}>
        Viz
      </Link>
    </header>
  );
};

export default Navbar;
