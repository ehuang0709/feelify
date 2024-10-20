import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QuizResult.css'; // Import the CSS for styling

function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers } = location.state || { answers: [] }; // Fallback if no answers provided

  const result = getResultFromAnswers(answers); // Get result based on answers

  return (
    <div className="quiz-result-container">
      <h2>You are a {result.result}!</h2>
      <img 
        src={result.image} 
        alt={result.result} 
        style={{ width: '200px', borderRadius: '8px' }} 
      />
      <p>{result.description}</p>
      <p><strong>Woman of Inspiration:</strong> {result.inspiringWoman}</p>

      <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>
        Here is a playlist we think fits you:
      </h3>

      <iframe className="results-playlist"
        src={result.playlist}
        width="700"
        height="600"
        frameBorder="0"
        allowTransparency="true"
        allow="encrypted-media"
      ></iframe>

      <button 
        onClick={() => navigate('/mood')} 
        className="back-button"
      >
        Go Back to Feeling
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
    inspiringWoman: 'Amelia Earhart, the first female aviator to fly solo across the Atlantic Ocean.',
    playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWXRqgorJj26U',
  },
  {
    result: 'Dreamer',
    image: 'https://via.placeholder.com/150?text=Dreamer',
    description: 'You live in your own world of creativity and wonder.',
    inspiringWoman: 'Dolores Huerta, a civil rights activist and labor leader who dreams of a better future.',
    playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8FwnYE6PRvL',
  },
  {
    result: 'Explorer',
    image: 'https://via.placeholder.com/150?text=Explorer',
    description: 'Adventure flows through your veins.',
    inspiringWoman: 'Jane Goodall, who explored the world of primates and revolutionized conservation.',
    playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXd9rSDyQguIk',
  },
  {
    result: 'Romantic',
    image: 'https://via.placeholder.com/150?text=Romantic',
    description: 'You are guided by your heart and love deeply.',
    inspiringWoman: 'Frida Kahlo, an artist whose work was filled with passion and emotion.',
    playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX9uKNf5jGX6m',
  },
  {
    result: 'Minimalist',
    image: 'https://via.placeholder.com/150?text=Minimalist',
    description: 'You find joy in simplicity.',
    inspiringWoman: 'Marie Kondo, who inspires people to declutter and live with intention.',
    playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3Ebqev5IkYU',
  },
  {
    result: 'Night Owl',
    image: 'https://via.placeholder.com/150?text=Night+Owl',
    description: 'The night inspires your best ideas.',
    inspiringWoman: 'Maya Angelou, who often wrote her masterpieces in the quiet hours of the night.',
    playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO',
  },
  {
    result: 'Sun Chaser',
    image: 'https://via.placeholder.com/150?text=Sun+Chaser',
    description: 'You are drawn to light and positivity.',
    inspiringWoman: 'Malala Yousafzai, a beacon of hope and education for girls worldwide.',
    playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX7KNKjOK0o75',
  },
  {
    result: 'Perfectionist',
    image: 'https://via.placeholder.com/150?text=Perfectionist',
    description: 'You strive to be the best in everything you do.',
    inspiringWoman: 'Serena Williams, a tennis champion known for her pursuit of excellence.',
    playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3YSRoSdA634',
  },
  {
    result: 'Free Spirit',
    image: 'https://via.placeholder.com/150?text=Free+Spirit',
    description: 'You follow your heart wherever it leads.',
    inspiringWoman: 'Zelda Fitzgerald, a writer and socialite known for her free-spirited nature.',
    playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXc6IFF23C9jj',
  },
  {
    result: 'Thinker',
    image: 'https://via.placeholder.com/150?text=Thinker',
    description: 'You love pondering deep questions and solving problems.',
    inspiringWoman: 'Marie Curie, a pioneering scientist and two-time Nobel Prize winner.',
    playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWXnscMH24yOc',
  },
];
