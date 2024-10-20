import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Mood from "../Mood/Mood.js"
import PreAuthenticationScreen from '../PreAuthenticationScreen/PreAuthenticationScreen.js';
import Home from '../Home/Home.js';
import { AnimatePresence } from 'framer-motion';
import Playlist from '../Playlist/Playlist.js';
import Quiz from '../Quiz/Quiz.js';
import QuizResult from '../QuizResult/QuizResult.js';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/pre-auth" element={<PreAuthenticationScreen />} />
        <Route path = "/playlist" element = {<Playlist />} />
        <Route path = "/quiz" element = {<Quiz />} />
        <Route path = "/quiz-result" element = {<QuizResult />} />
      </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;