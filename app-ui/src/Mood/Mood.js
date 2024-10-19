import React, { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import './Mood.css';
import PlaylistButton from '../PlaylistButton/PlaylistButton';

function Mood() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [womenOnly, setWomenOnly] = useState(false);
  const [showPlaylistButton, setShowPlaylistButton] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const r = useMotionValue(240);
  const g = useMotionValue(240);
  const b = useMotionValue(240);
  
  const setDefaultGradient = () => {
    const defaultColor = 'rgb(220, 220, 220)'; // A light gray color
    const gradientSize = '2500px';
    const backgroundColor = `radial-gradient(${gradientSize} at 50% 50%, ${defaultColor} 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%)`;
    document.body.style.background = backgroundColor;
  };
  useEffect(() => {
    setDefaultGradient();

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCheckboxChange = (event) => {
    setWomenOnly(event.target.checked);
  };

  const updateBackground = (xPos, yPos) => {
    const lowerSection = document.querySelector('.lower-section');
    const rect = lowerSection.getBoundingClientRect();
  
    const xNorm = Math.min(Math.max((xPos - rect.left) / rect.width, 0), 1);
    const yNorm = Math.min(Math.max((yPos - rect.top) / rect.height, 0), 1);
  
    const topLeft = { r: 191, g: 255, b: 127 };     // Pastel Yellow-Green
    const topRight = { r: 255, g: 191, b: 127 };    // Pastel Yellow-Red
    const bottomLeft = { r: 127, g: 191, b: 191 };  // Pastel Blue-Green
    const bottomRight = { r: 191, g: 127, b: 191 }; // Pastel Blue-Red
  
    const rValue =
      topLeft.r * (1 - xNorm) * (1 - yNorm) +
      topRight.r * xNorm * (1 - yNorm) +
      bottomLeft.r * (1 - xNorm) * yNorm +
      bottomRight.r * xNorm * yNorm;
  
    const gValue =
      topLeft.g * (1 - xNorm) * (1 - yNorm) +
      topRight.g * xNorm * (1 - yNorm) +
      bottomLeft.g * (1 - xNorm) * yNorm +
      bottomRight.g * xNorm * yNorm;
  
    const bValue =
      topLeft.b * (1 - xNorm) * (1 - yNorm) +
      topRight.b * xNorm * (1 - yNorm) +
      bottomLeft.b * (1 - xNorm) * yNorm +
      bottomRight.b * xNorm * yNorm;
  
    r.set(rValue);
    g.set(gValue);
    b.set(bValue);
  
    const spotlightX = (xPos / window.innerWidth) * 100;
    const spotlightY = (yPos / window.innerHeight) * 100;

    const gradientSize = '2500px';

    const backgroundColor = `radial-gradient(${gradientSize} at ${spotlightX}% ${spotlightY}%, rgb(${Math.round(rValue)}, ${Math.round(gValue)}, ${Math.round(bValue)}) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%)`;

    document.body.style.background = backgroundColor;
  };

  const moodLabels = [
    { name: 'Happy', style: { top: '5%', left: '5%' } }, // Upper Left
    { name: 'Hype', style: { top: '5%', right: '5%' } }, // Upper Right
    { name: 'Chill', style: { bottom: '5%', left: '5%' } }, // Lower Left
    { name: 'Sad', style: { bottom: '5%', right: '5%' } }, // Lower Right
  ];

  return (
    <div className="mood-container">
      <div className="text-container">
        <h1>HOW ARE YOU FEELING TODAY?</h1>
        <h3>DRAG THE PLAY ICON TO WHERE YOU RESONATE</h3>
      </div>

      <div className="lower-section">
        {/* Render Mood Labels */}
        {moodLabels.map((mood) => (
          <div key={mood.name} className="mood-label" style={mood.style}>
            {mood.name}
          </div>
        ))}
  
          <motion.div
          className="draggable-arrow"
          drag
          dragMomentum={false}
          dragConstraints={{
            left: -windowSize.width / 2 + 22.5,
            right: windowSize.width / 2 - 22.5,
            top: -windowSize.height / 2 + 25,
            bottom: windowSize.height / 2 - 25,
          }}
          style={{ x, y }}
          onDrag={(event, info) => {
            const xPos = info.point.x;
            const yPos = info.point.y;
            updateBackground(xPos, yPos);
            setShowPlaylistButton(true)
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
        >
          <div className="triangle"></div>
        </motion.div>
      </div>

      <div className="checkbox-container">
        <label>
          <input
            type="checkbox"
            checked={womenOnly}
            onChange={handleCheckboxChange}
          />
          Female Artists Only
        </label>
      </div>

<div className={`button-container ${showPlaylistButton ? 'show-button' : ''}`}>
  <PlaylistButton
    showButton={showPlaylistButton}
    onClick={() => alert('Generating playlist...')}
  />
</div>
    </div>
  );
}

export default Mood;
