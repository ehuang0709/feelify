import React from 'react';
import { motion } from 'framer-motion';
import './Mood.css';

function Mood() {
  const moods = [
    { name: 'Happy', position: 'top' },
    { name: 'Chill', position: 'left' },
    { name: 'Hype', position: 'right' },
    { name: 'Sad', position: 'bottom' },
  ];

  return (
    <div className="mood-container">
      <div className="text-container">
        <h1>How are you feeling today?</h1>
        <h3>Drag the play arrow icon to where you resonate!</h3>
      </div>
      {moods.map((mood) => (
        <div key={mood.name} className={`mood-area ${mood.position}`}>
          <motion.div
            className="mood-label"
            whileHover={{ scale: 1.1 }}
          >
            {mood.name}
          </motion.div>
        </div>
      ))}
      <motion.div
        className="draggable-arrow"
        drag
        dragMomentum={false}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
      >
        <div className="triangle"></div>
      </motion.div>
    </div>
  );
}

export default Mood;