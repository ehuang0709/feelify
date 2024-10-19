import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Mood from "../Mood/Mood.js"
import PreAuthenticationScreen from '../PreAuthenticationScreen/PreAuthenticationScreen.js';
import Home from '../Home/Home.js';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/pre-auth" element={<PreAuthenticationScreen />} />
      </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;