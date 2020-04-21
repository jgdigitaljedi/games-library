import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/luna-blue/theme.css';
import React, { useEffect } from 'react';
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

declare global {
  interface Window {
    urlPrefix: string;
  }
}

window.urlPrefix = UrlService.prefix;

function App(): JSX.Element {
  useEffect(() => {
    const currentPath = window.location.pathname.split('/');
    const lastPath = currentPath[currentPath.length - 1];
    if (
      lastPath === 'decider' ||
      lastPath === 'library' ||
      lastPath === 'lists' ||
      lastPath === 'viz'
    ) {
      navigate(`/${lastPath}`);
    }
  }, []);
  return (
    <React.StrictMode>
      <Provider store={store}>
        <div className="App">
          <CombinedContextProvider>
            <Navbar />
            <Router basepath="/gameslib">
              <Home default path="/" />
              <Decider path="/decider" />
              <Library path="/library" />
              <Lists path="/lists" />
              <Viz path={`/viz`} />
            </Router>
          </CombinedContextProvider>
        </div>
      </Provider>
    </React.StrictMode>
  );
}

export default App;
