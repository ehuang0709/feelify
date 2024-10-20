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
      <div className="inspiration-container">
    <p><strong>Woman of Inspiration:</strong> {result.inspiringWoman}</p>
  </div>

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
      image: 'adventurer.webp',
      description: 'You love exploring the unknown and embracing new experiences.',
      inspiringWoman: 'Amelia Earhart, the first female aviator to fly solo across the Atlantic Ocean, who broke barriers in aviation and inspired generations of adventurers.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWXRqgorJj26U',
    },
    {
      result: 'Dreamer',
      image: 'dreamer.webp',
      description: 'You live in your own world of creativity and wonder.',
      inspiringWoman: 'Dolores Huerta, a civil rights activist and labor leader, who co-founded the United Farm Workers and fought tirelessly for social justice and workers’ rights, inspiring generations to dream of a fairer world.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8FwnYE6PRvL',
    },
    {
      result: 'Explorer',
      image: 'explorer.webp',
      description: 'Adventure flows through your veins.',
      inspiringWoman: 'Jane Goodall, a pioneering primatologist and conservationist, who redefined humanity’s understanding of chimpanzees and dedicated her life to environmental activism.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXd9rSDyQguIk',
    },
    {
      result: 'Romantic',
      image: 'romantic.webp',
      description: 'You are guided by your heart and love deeply.',
      inspiringWoman: 'Frida Kahlo, a celebrated Mexican artist known for her vivid self-portraits and surrealist style, whose art explored themes of love, pain, and identity.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX9uKNf5jGX6m',
    },
    {
      result: 'Visionary',
      image: 'visionary.webp',
      description: 'You have bold ideas and inspire others to see the world differently.',
      inspiringWoman: 'Ada Lovelace, the first computer programmer, who envisioned how machines could perform tasks beyond arithmetic, laying the foundation for modern computing.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3Ebqev5IkYU',
    },
    {
      result: 'Night Owl',
      image: 'nightowl.webp',
      description: 'The night inspires your best ideas.',
      inspiringWoman: 'Maya Angelou, a poet, memoirist, and civil rights activist, who often found creative inspiration in the quiet hours of the night and whose words continue to inspire millions.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO',
    },
    {
      result: 'Sun Chaser',
      image: 'sunchaser.webp',
      description: 'You are drawn to light and positivity.',
      inspiringWoman: 'Greta Thunberg, a young climate activist who has mobilized millions around the world to demand action on climate change, becoming a beacon of hope and resilience.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX7KNKjOK0o75',
    },
    {
      result: 'Perfectionist',
      image: 'perfectionist.webp',
      description: 'You strive to be the best in everything you do.',
      inspiringWoman: 'Serena Williams, one of the greatest tennis players of all time, whose relentless pursuit of excellence and resilience have redefined the world of sports.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3YSRoSdA634',
    },
    {
      result: 'Free Spirit',
      image: 'freespirit.webp',
      description: 'You follow your heart wherever it leads.',
      inspiringWoman: 'Zelda Fitzgerald, a writer and socialite of the Jazz Age, known for her creative talents and her struggles to live life on her own terms despite societal expectations.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXc6IFF23C9jj',
    },
    {
      result: 'Thinker',
      image: 'thinker.webp',
      description: 'You love pondering deep questions and solving problems.',
      inspiringWoman: 'Marie Curie, a pioneering scientist and the first woman to win two Nobel Prizes, whose discoveries in radioactivity changed the course of science forever.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWXnscMH24yOc',
    },
  ];
  
