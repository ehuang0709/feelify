import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Mood from "../Mood/Mood.js"
import PreAuthenticationScreen from '../PreAuthenticationScreen/PreAuthenticationScreen.js';
import Home from '../Home/Home.js';
import { AnimatePresence } from 'framer-motion';
import Playlist from "../Playlist/Playlist.js"

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/pre-auth" element={<PreAuthenticationScreen />} />
        <Route path = "/playlist" element = {<Playlist />} />
      </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;