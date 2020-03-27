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
        navigate('/home');
      }
    },
    {
      label: 'Library',
      icon: 'pi pi-table',
      className: active === 'library' ? 'active' : '',
      command: () => {
        setActive('library');
        navigate('/library');
      }
    },
    {
      label: 'Decider',
      icon: 'pi pi-images',
      className: active === 'decider' ? 'active' : '',
      command: () => {
        setActive('decider');
        navigate('/decider');
      }
    },
    {
      label: 'Lists',
      icon: 'pi pi-list',
      className: active === 'lists' ? 'active' : '',
      command: () => {
        setActive('lists');
        navigate('/lists');
      }
    },
    {
      label: 'Viz',
      icon: 'pi pi-chart-bar',
      className: active === 'viz' ? 'active' : '',
      command: () => {
        setActive('viz');
        navigate('/viz');
      }
    },
    {
      label: 'Manage',
      icon: 'pi pi-sitemap',
      className: active === 'manage' ? 'active' : '',
      command: () => {
        setActive('manage');
        navigate('/manage');
      }
    }
  ];

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
      <div className="main-nav">
        <Link
          to="/"
          className={active === 'home' ? 'active' : ''}
          onClick={() => setActive('home')}
        >
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
        <Link
          to="/viz"
          className={active === 'viz' ? 'active' : ''}
          onClick={() => setActive('viz')}
        >
          Viz
        </Link>
        <Link
          to="/manage"
          className={active === 'manage' ? 'active' : ''}
          onClick={() => setActive('manage')}
        >
          Manage
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
