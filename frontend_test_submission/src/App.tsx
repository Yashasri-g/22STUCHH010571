import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Analytics from './components/Analytics';
import Redirect from './components/Redirect';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/:shortId" element={<Redirect />} />
      </Routes>
    </Router>
  );
};

export default App;