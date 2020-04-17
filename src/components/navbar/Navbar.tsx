import React, { FunctionComponent, useState } from 'react';
import { Menu } from 'primereact/menu';
import { Link, navigate } from '@reach/router';

const Navbar: FunctionComponent = () => {
  const [active, setActive] = useState<string>('');
  let menuEle: any;
  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      className: active === 'home' ? 'active' : '',
      command: () => {
        setActive('home');
        navigate(`/gameslib/home`);
      }
    },
    {
      label: 'Library',
      icon: 'pi pi-table',
      className: active === 'library' ? 'active' : '',
      command: () => {
        setActive('library');
        navigate(`/gameslib/library`);
      }
    },
    {
      label: 'Decider',
      icon: 'pi pi-images',
      className: active === 'decider' ? 'active' : '',
      command: () => {
        setActive('decider');
        navigate(`/gameslib/decider`);
      }
    },
    {
      label: 'Lists',
      icon: 'pi pi-list',
      className: active === 'lists' ? 'active' : '',
      command: () => {
        setActive('lists');
        navigate(`/gameslib/lists`);
      }
    },
    {
      label: 'Viz',
      icon: 'pi pi-chart-bar',
      className: active === 'viz' ? 'active' : '',
      command: () => {
        setActive('viz');
        navigate(`/gameslib/viz`);
      }
    }
  ];

  function routeOnLoad() {
    const pn = window.location.pathname;
    let route = pn === '/gameslib' ? 'home' : pn.replace('/gameslib/', '');
    setActive(route);
  }

  if (!active || !active.length) {
    routeOnLoad();
  }

  return (
    <header className="navbar">
      <div className="main-nav">
        <Link
          to="/gameslib"
          className={active === 'home' ? 'active' : ''}
          onClick={() => setActive('home')}
        >
          Home
        </Link>
        <Link
          to="/gameslib/library"
          className={active === 'library' ? 'active' : ''}
          onClick={() => setActive('library')}
        >
          Library
        </Link>
        <Link
          to="/gameslib/decider"
          className={active === 'decider' ? 'active' : ''}
          onClick={() => setActive('decider')}
        >
          Decider
        </Link>
        <Link
          to="/gameslib/lists"
          className={active === 'lists' ? 'active' : ''}
          onClick={() => setActive('lists')}
        >
          Lists
        </Link>
        <Link
          to="/gameslib/viz"
          className={active === 'viz' ? 'active' : ''}
          onClick={() => setActive('viz')}
        >
          Viz
        </Link>
      </div>
      <div className="mobile-nav">
        <i
          className="pi pi-bars"
          onClick={e => {
            // @ts-ignore
            menuEle.toggle(e);
          }}
        ></i>
        <Menu className="mobile-nav--menu" popup={true} model={items} ref={el => (menuEle = el)} />
      </div>
    </header>
  );
};

export default Navbar;
