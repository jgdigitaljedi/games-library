import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/luna-blue/theme.css';
import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/navbar/Navbar';
import { Router } from '@reach/router';
import Home from './Home';
import Decider from './Decider';
import Library from './Library';
import Lists from './Lists';
import { DataContextProvider } from './context/DataContext';

function App(): JSX.Element {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <div className="App">
          <DataContextProvider>
            <Navbar />
            <Router>
              <Home path="/" />
              <Decider path="/decider" />
              <Library path="/library" />
              <Lists path="/lists" />
            </Router>
          </DataContextProvider>
        </div>
      </Provider>
    </React.StrictMode>
  );
}

export default App;
