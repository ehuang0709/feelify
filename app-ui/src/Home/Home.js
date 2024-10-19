import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';

import ArrowAnimation from '../ArrowAnimation';
import '../App/App.css';

function Home() {
  const navigate = useNavigate();
  const controls = useAnimation();

  const handleHomeArrowClick = () => {
    controls.start('out');
  };

  const pageVariants = {
    initial: {
      y: 0,
    },
    out: {
      y: '-100%', 
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className="App"
      initial="initial"
      animate={controls}
      variants={pageVariants}
      onAnimationComplete={(definition) => {
        if (definition === 'out') {
          navigate('/mood');
        }
      }}
    >
      <header className="App-header">
        <h1 className="logo">FEELIFY</h1>
        <h2 className="subtitle">YOUR EMOTIONS, YOUR PLAYLIST</h2>
        <p className="description">INSTANTLY CREATE MUSIC THAT RESONATES</p>
        <ArrowAnimation handleClick={handleHomeArrowClick} />
      </header>
    </motion.div>
  );
}

export default Home;
