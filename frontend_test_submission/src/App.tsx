import React from 'react';
import './App.css';
import { logFrontend } from './utils/logger';

function App() {
  const handleSuccessLog = () => {
    logFrontend('info', 'component', 'User clicked on the success button.');
  };

  const handleErrorLog = () => {
    logFrontend('error', 'component', 'Simulated frontend error occurred.');
  };

  return (
    <div className="App">
      <h1>Frontend Logging Test</h1>
      <button className="log-button success" onClick={handleSuccessLog}>
        Log Info
      </button>
      <button className="log-button error" onClick={handleErrorLog}>
        Log Error
      </button>
    </div>
  );
}

export default App;
