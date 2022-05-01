import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { Menu } from 'primereact/menu';
import { Link, navigate } from '@reach/router';
import { Button } from 'primereact/button';
import { AUTH_KEY_LOCAL_STORAGE } from '@/constants';
import { Dialog } from 'primereact/dialog';
import LoginDialog from '../LoginDialog/LoginDialog';
import { ILoginResult } from '@/models/crud.model';
import { NotificationContext } from '@/context/NotificationContext';
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux';
import changeUserState from '../../actionCreators/userState';

interface MapStateProps {
  userState: boolean;
}

interface MapDispatchProps {
  setUserState: (state: boolean) => void;
}

interface IProps extends MapDispatchProps, MapStateProps {}

const Navbar: FunctionComponent<IProps> = (props: IProps) => {
  // eslint-disable-next-line
  const [notify, setNotify] = useContext(NotificationContext);
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const loggedIn = useSelector((state: any) => state.userState);

  const openLoginDialog = () => {
    setShowModal(true);
  };

  const authKeyChange = (result: ILoginResult) => {
    const key = result.data.key;
    if (result.data.error) {
      localStorage.removeItem(AUTH_KEY_LOCAL_STORAGE);
      props.setUserState(false);
      setAuthKey(null);
      setNotify({
        severity: 'error',
        detail: result.data.message,
        summary: 'FORBIDDEN'
      });
      // @TODO: notification of error
    } else {
      localStorage.setItem(AUTH_KEY_LOCAL_STORAGE, key);
      props.setUserState(true);
      setAuthKey(key);
      // @TODO: notification of success
      setNotify({
        severity: 'success',
        detail: result.data.message,
        summary: 'Welcome!'
      });
      setShowModal(false);
    }
  };

  const loginInOut = () => {
    if (authKey) {
      setAuthKey(null);
      localStorage.removeItem(AUTH_KEY_LOCAL_STORAGE);
      props.setUserState(false);
    } else {
      props.setUserState(true);
      openLoginDialog();
    }
  };

  useEffect(() => {
    const localKey = localStorage.getItem(AUTH_KEY_LOCAL_STORAGE);
    setAuthKey(localKey);
    props.setUserState(!!localKey);
    setTimeout(() => {
      const pnSplit = window.location.pathname.split('/');
      const path = pnSplit[pnSplit.length - 1];
      if (path === '' || path === 'gameslib' || path === 'home') {
        setActive('home');
      } else if (path === 'library' || path === 'decider' || path === 'viz' || path === 'lists') {
        setActive(path);
      }
    });
  }, [setAuthKey, props]);

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
      label: 'Platforms',
      icon: 'pi pi-mobile',
      className: active === 'platforms' ? 'active' : '',
      command: () => {
        setActive('platforms');
        navigate(`/gameslib/platforms`);
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
      label: loggedIn ? 'Logout' : 'Login',
      icon: loggedIn ? 'pi pi-lock' : 'pi pi-lock-open',
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
    <header className='navbar'>
      <div className='main-nav'>
        <Link
          to='/gameslib'
          className={active === 'home' ? 'active' : ''}
          onClick={() => setActive('home')}
        >
          Home
        </Link>
        <Link
          to='/gameslib/library'
          className={active === 'library' ? 'active' : ''}
          onClick={() => setActive('library')}
        >
          Library
        </Link>
        <Link
          to='/gameslib/decider'
          className={active === 'decider' ? 'active' : ''}
          onClick={() => setActive('decider')}
        >
          Decider
        </Link>
        <Link
          to='/gameslib/lists'
          className={active === 'lists' ? 'active' : ''}
          onClick={() => setActive('lists')}
        >
          Lists
        </Link>
        <Link
          to='/gameslib/platforms'
          className={active === 'platforms' ? 'active' : ''}
          onClick={() => setActive('platforms')}
        >
          Platforms
        </Link>
        <Link
          to='/gameslib/viz'
          className={active === 'viz' ? 'active' : ''}
          onClick={() => setActive('viz')}
        >
          Viz
        </Link>
        <Link
          to='/gameslib/gallery'
          className={active === 'gallery' ? 'active' : ''}
          onClick={() => setActive('gallery')}
        >
          Gallery
        </Link>
      </div>
      <div className='auth-nav'>
        <Button
          icon={authKey ? 'pi pi-lock' : 'pi pi-lock-open'}
          className='p-button-text'
          onClick={loginInOut}
        />
      </div>
      <div className='mobile-nav'>
        <i
          className='pi pi-bars'
          onClick={e => {
            // @ts-ignore
            menuEle.toggle(e);
          }}
        />
        <Menu className='mobile-nav--menu' popup={true} model={items} ref={el => (menuEle = el)} />
      </div>
      <Dialog
        visible={showModal}
        header='Login, but only if you are Joey!'
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

const mapStateToProps = ({ userState }: { userState: boolean }): MapStateProps => {
  return {
    userState
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchProps => ({
  setUserState: (state: boolean) => dispatch(changeUserState(state))
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
