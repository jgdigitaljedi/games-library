import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/luna-blue/theme.css';
import React, { useEffect, useState } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/navbar/Navbar';
import { Router, navigate } from '@reach/router';
import Home from './Home';
import Decider from './Decider';
import Library from './Library';
import Lists from './Lists';
import Viz from './Viz';
import { CombinedContextProvider } from './context/CombinedContext';
import UrlService from './services/url.service';
import GalleryComponent from './Gallery';
import { NotificationContextProvider } from './context/NotificationContext';
import NotificationWrapper from './NotificationWrapper';
import ItemsContext from './context/ItemsContext';
import { getItems } from './services/generalCrud.service';

declare global {
  interface Window {
    urlPrefix: string;
  }
}

window.urlPrefix = UrlService.prefix;

function App(): JSX.Element {
  const [items, setItems] = useState({ platformsWithId: [] });
  useEffect(() => {
    const search = window.location.search;
    if (search) {
      navigate(`/gameslib/${search.substring(1)}`);
    }
  }, []);

  useEffect(() => {
    async function fetchItems() {
      const result = await getItems();
      setItems(result.data);
    }
    fetchItems();
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <div className='App'>
          <CombinedContextProvider>
            <></>
            {/* @ts-ignore */}
            <ItemsContext.Provider value={items}>
              <></>
              <NotificationContextProvider>
                <Navbar />
                <NotificationWrapper>
                  <Router>
                    <Home default path='/gameslib' />
                    <Decider path='/gameslib/decider' />
                    <Library path='/gameslib/library' />
                    <Lists path='/gameslib/lists' />
                    <Viz path={`/gameslib/viz`} />
                    <GalleryComponent path={`/gameslib/gallery`} />
                  </Router>
                </NotificationWrapper>
              </NotificationContextProvider>
            </ItemsContext.Provider>
          </CombinedContextProvider>
        </div>
      </Provider>
    </React.StrictMode>
  );
}

export default App;
