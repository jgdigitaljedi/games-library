import React, { FunctionComponent, useState, useEffect } from 'react';
import { Menu } from 'primereact/menu';
import { Link, navigate } from '@reach/router';
import { Button } from 'primereact/button';
import { AUTH_KEY_LOCAL_STORAGE } from '../../constants';
import { Dialog } from 'primereact/dialog';
import LoginDialog from '../LoginDialog/LoginDialog';

const Navbar: FunctionComponent = () => {
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const openLoginDialog = () => {
    setShowModal(true);
  };

  const authKeyChange = (newKey: string) => {
    localStorage.setItem(AUTH_KEY_LOCAL_STORAGE, newKey);
    setAuthKey(newKey);
  };

  const loginInOut = () => {
    if (authKey) {
      setAuthKey(null);
      localStorage.removeItem(AUTH_KEY_LOCAL_STORAGE);
    } else {
      openLoginDialog();
    }
  };

  useEffect(() => {
    setAuthKey(localStorage.getItem(AUTH_KEY_LOCAL_STORAGE));
    setTimeout(() => {
      const pnSplit = window.location.pathname.split('/');
      const path = pnSplit[pnSplit.length - 1];
      if (path === '' || path === 'gameslib' || path === 'home') {
        setActive('home');
      } else if (path === 'library' || path === 'decider' || path === 'viz' || path === 'lists') {
        setActive(path);
      }
    });
  }, [setAuthKey]);

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
    },
    {
      label: 'Gallery',
      icon: 'pi pi-image',
      className: active === 'gallery' ? 'active' : '',
      command: () => {
        setActive('gallery');
        navigate(`/gameslib/gallery`);
      }
    },
    {
      label: authKey ? 'Logout' : 'Login',
      icon: authKey ? 'pi pi-lock' : 'pi pi-lock-open',
      command: loginInOut
    }
  ];

  function routeOnLoad() {
    const pn = window.location.pathname;
    let route = pn === '/gameslib' || pn === '/gameslib/' ? 'home' : pn.replace('/gameslib/', '');
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
        <Link
          to="/gameslib/gallery"
          className={active === 'gallery' ? 'active' : ''}
          onClick={() => setActive('gallery')}
        >
          Gallery
        </Link>
      </div>
      <div className="auth-nav">
        <Button
          icon={authKey ? 'pi pi-lock' : 'pi pi-lock-open'}
          className="p-button-text"
          onClick={loginInOut}
        />
      </div>
      <div className="mobile-nav">
        <i
          className="pi pi-bars"
          onClick={(e) => {
            // @ts-ignore
            menuEle.toggle(e);
          }}
        ></i>
        <Menu
          className="mobile-nav--menu"
          popup={true}
          model={items}
          ref={(el) => (menuEle = el)}
        />
      </div>
      <Dialog
        visible={showModal}
        header="Login, but only if you are Joey!"
        modal={true}
        closeOnEscape={true}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <LoginDialog authKeyChange={authKeyChange} />
      </Dialog>
    </header>
  );
};

export default Navbar;
