import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Mood from "../Mood/Mood.js"
import PreAuthenticationScreen from '../PreAuthenticationScreen/PreAuthenticationScreen.js';
import Home from '../Home/Home.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/pre-auth" element={<PreAuthenticationScreen />} />
      </Routes>
    </Router>
  );
}

export default App;