import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QuizResult.css'; // Import the CSS for styling

function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers } = location.state || { answers: [] }; // Fallback if no answers provided

  const result = getResultFromAnswers(answers); // Get result based on answers

  return (
    <div className="quiz-container">
      <h2>You are a {result.result}!</h2>
      <img 
        src={result.image} 
        alt={result.result} 
        style={{ width: '200px', borderRadius: '8px' }} 
      />
      <p>{result.description}</p>

      {/* New text above the playlist */}
      <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>
        Here is a playlist we think fits you:
      </h3>

      <iframe
        src={result.playlist}
        width="600"
        height="380"
        frameBorder="0"
        allowTransparency="true"
        allow="encrypted-media"
        style={{ marginBottom: '20px' }}
      ></iframe>

      <button 
        onClick={() => navigate('/')} 
        className="back-button"
      >
        Go Back to Home
      </button>
    </div>
  );
}

export default QuizResult;
export const getResultFromAnswers = (answers) => {
    const sum = answers.reduce((acc, val) => acc + val, 0);
    const index = sum % resultData.length; // Use modulo to avoid out-of-bounds
    return resultData[index]; // Return the selected result object
  };

export const resultData = [
    {
      result: 'Adventurer',
      image: 'https://via.placeholder.com/150?text=Adventurer',
      description: 'You love exploring the unknown and embracing new experiences.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWXRqgorJj26U',
    },
    {
      result: 'Dreamer',
      image: 'https://via.placeholder.com/150?text=Dreamer',
      description: 'You live in your own world of creativity and wonder.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8FwnYE6PRvL',
    },
    {
      result: 'Explorer',
      image: 'https://via.placeholder.com/150?text=Explorer',
      description: 'Adventure flows through your veins.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXd9rSDyQguIk',
    },
    {
      result: 'Romantic',
      image: 'https://via.placeholder.com/150?text=Romantic',
      description: 'You are guided by your heart and love deeply.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX9uKNf5jGX6m',
    },
    {
      result: 'Minimalist',
      image: 'https://via.placeholder.com/150?text=Minimalist',
      description: 'You find joy in simplicity.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3Ebqev5IkYU',
    },
    {
      result: 'Night Owl',
      image: 'https://via.placeholder.com/150?text=Night+Owl',
      description: 'The night inspires your best ideas.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO',
    },
    {
      result: 'Sun Chaser',
      image: 'https://via.placeholder.com/150?text=Sun+Chaser',
      description: 'You are drawn to light and positivity.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX7KNKjOK0o75',
    },
    {
      result: 'Perfectionist',
      image: 'https://via.placeholder.com/150?text=Perfectionist',
      description: 'You strive to be the best in everything you do.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3YSRoSdA634',
    },
    {
      result: 'Free Spirit',
      image: 'https://via.placeholder.com/150?text=Free+Spirit',
      description: 'You follow your heart wherever it leads.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXc6IFF23C9jj',
    },
    {
      result: 'Thinker',
      image: 'https://via.placeholder.com/150?text=Thinker',
      description: 'You love pondering deep questions and solving problems.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWXnscMH24yOc',
    },
  ];
  