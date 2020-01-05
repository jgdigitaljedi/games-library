import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import React from 'react';
import './App.css';
import Navbar from './Navbar';

function App() {
  return (
    <React.StrictMode>
      <div className="App">
        <Navbar />
      </div>
    </React.StrictMode>
  );
}

export default App;
