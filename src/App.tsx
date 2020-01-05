import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import React from 'react';
import './App.css';
import Navbar from './Navbar';
import { Router } from '@reach/router';
import Home from './Home';
import Decider from './Decider';
import Library from './Library';

function App(): JSX.Element {
  return (
    <React.StrictMode>
      <div className="App">
        <Navbar />
        <Router>
          <Home path="/" />
          <Decider path="/decider" />
          <Library path="/library" />
        </Router>
      </div>
    </React.StrictMode>
  );
}

export default App;
