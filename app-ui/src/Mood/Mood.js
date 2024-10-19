import React from 'react';
import { motion } from 'framer-motion';
import './Mood.css';

function Mood() {
  return (
    <div className="mood-container">
      <h1>Mood Page</h1>
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
