import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './Mood.css';

function Mood() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [womenOnly, setWomenOnly] = useState(false);

  const x = useMotionValue(windowSize.width / 2);
  const y = useMotionValue(windowSize.height / 2);

  const r = useMotionValue(240);
  const g = useMotionValue(240);
  const b = useMotionValue(240);

  const rSpring = useSpring(r, { stiffness: 50, damping: 20 });
  const gSpring = useSpring(g, { stiffness: 50, damping: 20 });
  const bSpring = useSpring(b, { stiffness: 50, damping: 20 });

  useEffect(() => {
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
    const xNorm = Math.min(Math.max(xPos / windowSize.width, 0), 1);
    const yNorm = Math.min(Math.max(yPos / windowSize.height, 0), 1);

    // Pastel corner colors (blended with white)
    const topLeft = { r: 191, g: 255, b: 127 };     // Pastel Yellow-Green
    const topRight = { r: 255, g: 191, b: 127 };    // Pastel Yellow-Red
    const bottomLeft = { r: 127, g: 191, b: 191 };  // Pastel Blue-Green
    const bottomRight = { r: 191, g: 127, b: 191 }; // Pastel Blue-Red

    // Perform bilinear interpolation
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
  };

  useEffect(() => {
    const update = () => {
      const backgroundColor = `rgb(${Math.round(rSpring.get())}, ${Math.round(
        gSpring.get()
      )}, ${Math.round(bSpring.get())})`;
      document.body.style.background = backgroundColor;
    };

    const unsubscribeR = rSpring.onChange(update);
    const unsubscribeG = gSpring.onChange(update);
    const unsubscribeB = bSpring.onChange(update);

    return () => {
      unsubscribeR();
      unsubscribeG();
      unsubscribeB();
    };
  }, [rSpring, gSpring, bSpring]);

  // Define mood labels and positions
  const moodLabels = [
    {
      name: 'Relaxed',
      style: { top: '10%', left: '10%' }, // Upper Left
    },
    {
      name: 'Excited',
      style: { top: '10%', right: '10%' }, // Upper Right
    },
    {
      name: 'Calm',
      style: { bottom: '10%', left: '10%' }, // Lower Left
    },
    {
      name: 'Energetic',
      style: { bottom: '10%', right: '10%' }, // Lower Right
    },
  ];

  return (
    <div className="mood-container">
      <div className="text-container">
        <h1>How are you feeling today?</h1>
        <h3>Drag the play arrow icon to where you resonate!</h3>
      </div>

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
        style={{ x, y }}
        onDrag={(event, info) => updateBackground(info.point.x, info.point.y)}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
      >
        <div className="triangle"></div>
      </motion.div>
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
    </div>
  );
}

export default Mood;
