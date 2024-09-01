import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Quize from './pages/Quize/Quize';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:id" element={<Quize />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
