import React, { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Mood.css';
import PlaylistButton from '../PlaylistButton/PlaylistButton';

function Mood() {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [womenOnly, setWomenOnly] = useState(false);
  const [showPlaylistButton, setShowPlaylistButton] = useState(false);
  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0 });
  const [currentColor, setCurrentColor] = useState({ r: 220, g: 220, b: 220 });
  const [xNormValue, setXNormValue] = useState(0);
  const [yNormValue, setYNormValue] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const r = useMotionValue(240);
  const g = useMotionValue(240);
  const b = useMotionValue(240);

  const setDefaultGradient = () => {
    const defaultColor = 'rgb(220, 220, 220)';
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
    const yNorm = Math.min(Math.max((yPos - rect.top) / window.innerHeight, 0), 1);

    setXNormValue(xNorm);
    setYNormValue(yNorm);
  
    const topLeft = { r: 191, g: 255, b: 127 };
    const topRight = { r: 255, g: 191, b: 127 };
    const bottomLeft = { r: 127, g: 191, b: 191 };
    const bottomRight = { r: 191, g: 127, b: 191 };
  
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

    return { r: Math.round(rValue), g: Math.round(gValue), b: Math.round(bValue) };
  };

  const moodLabels = [
    { name: 'Chill', style: { top: '5%', left: '50%' } },
    { name: 'Happy', style: { top: '50%', right: '5%' } },
    { name: 'Hype', style: { bottom: '5%', left: '50%' } },
    { name: 'Sad', style: { bottom: '50%', left: '5%' } },
  ];

  const handlePlaylistButtonClick = () => {
    navigate('/pre-auth', {
      state: {
        energy: yNormValue/0.67,
        valence: xNormValue
      }
    });
  };

  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  return (
    <div className="mood-container">
      <div className="text-container">
        <h1>HOW ARE YOU FEELING TODAY?</h1>
        <h3>DRAG THE PLAY ICON TO WHERE YOU RESONATE</h3>
      </div>

      <div className="lower-section">
        {moodLabels.map((mood) => {
          const moodX = mood.style.left ? parseFloat(mood.style.left) / 100 * windowSize.width : 
                        (1 - parseFloat(mood.style.right) / 100) * windowSize.width;
          const moodY = mood.style.top ? parseFloat(mood.style.top) / 100 * windowSize.height : 
                        (1 - parseFloat(mood.style.bottom) / 100) * windowSize.height;
          
          const dist = distance(arrowPosition.x, arrowPosition.y, moodX, moodY);
          const maxDist = Math.sqrt(Math.pow(windowSize.width, 2) + Math.pow(windowSize.height, 2));
          const scale = 1 + (1 - Math.min(dist / maxDist, 1)) * 0.5;

          return (
            <motion.div
              key={mood.name}
              className="mood-label"
              style={{
                ...mood.style,
                scale: scale,
              }}
              animate={{ scale: scale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {mood.name}
            </motion.div>
          );
        })}
  
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
            const color = updateBackground(xPos, yPos);
            setShowPlaylistButton(true);
            setArrowPosition({ x: xPos, y: yPos });
            setCurrentColor(color);
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
        >
          <div className="triangle"></div>
        </motion.div>
      </div>

      <div className={`button-container ${showPlaylistButton ? 'show-button' : ''}`}>
        <PlaylistButton
          showButton={showPlaylistButton}
          onClick={handlePlaylistButtonClick}
          color={currentColor}
        />
      </div>
    </div>
  );
}

export default Mood;