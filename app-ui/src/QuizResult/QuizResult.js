import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QuizResult.css'; // Import the CSS for styling

function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers } = location.state || { answers: [] };

  const result = getResultFromAnswers(answers);

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

      <iframe 
        className="results-playlist"
        src={result.playlist}
        width="700"
        height="600"
        frameBorder="0"
        allowTransparency="true"
        allow="encrypted-media"
      ></iframe>

      <div className="artist-recommendation" style={{ marginTop: '30px' }}>
        <h3>You should listen to: {result.artist.name}</h3>
        <img 
          src={result.artist.image} 
          alt={result.artist.name} 
          style={{ width: '150px', borderRadius: '8px' }} 
        />
      </div>

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
  const index = sum % resultData.length;
  return resultData[index];
};

export const resultData = [
    {
      result: 'Adventurer',
      image: 'adventurer.webp',
      description: 'Adventure flows through your veins.',
      inspiringWoman: 'Amelia Earhart, the first female aviator to fly solo across the Atlantic Ocean, who broke barriers in aviation and inspired generations of adventurers.',
      playlist: 'https://open.spotify.com/embed/playlist/3xrbwOJGdSFy9X05euzlpa',
      artist: {
        name: 'Florence Welch',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Florence_Welch.jpg/800px-Florence_Welch.jpg',
      },
    },
    {
      result: 'Dreamer',
      image: 'dreamer.webp',
      description: 'You live in your own world of creativity and wonder.',
      inspiringWoman: 'Dolores Huerta, a civil rights activist and labor leader, who co-founded the United Farm Workers and fought tirelessly for social justice and workers’ rights.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWSiZVO2J6WeI',
      artist: {
        name: 'Lorde',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Lorde_Roskilde_Festival_2017.jpg/800px-Lorde_Roskilde_Festival_2017.jpg',
      },
    },
    {
      result: 'Explorer',
      image: 'explorer.webp',
      description: 'You love exploring the unknown and embracing new experiences.',
      inspiringWoman: 'Jane Goodall, a pioneering primatologist and conservationist, who redefined humanity’s understanding of chimpanzees and dedicated her life to environmental activism.',
      playlist: 'https://open.spotify.com/embed/playlist/3ecmVHxXUkDcI90rBup8oT',
      artist: {
        name: 'Bjork',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Bjork_-_Hurricane_Festival.jpg/800px-Bjork_-_Hurricane_Festival.jpg',
      },
    },
    {
      result: 'Romantic',
      image: 'romantic.webp',
      description: 'You are guided by your heart and love deeply.',
      inspiringWoman: 'Frida Kahlo, a celebrated Mexican artist known for her vivid self-portraits and surrealist style, whose art explored themes of love, pain, and identity.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX7rOY2tZUw1k',
      artist: {
        name: 'Adele',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Adele_2016.jpg/800px-Adele_2016.jpg',
      },
    },
    {
      result: 'Visionary',
      image: 'visionary.webp',
      description: 'You have bold ideas and inspire others to see the world differently.',
      inspiringWoman: 'Ada Lovelace, the first computer programmer, who envisioned how machines could perform tasks beyond arithmetic, laying the foundation for modern computing.',
      playlist: 'https://open.spotify.com/embed/playlist/4r5uW1tgqNv5Rp6CPH4pcN',
      artist: {
        name: 'Grimes',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Grimes_2012.jpg/800px-Grimes_2012.jpg',
      },
    },
    {
      result: 'Night Owl',
      image: 'nightowl.webp',
      description: 'The night inspires your best ideas.',
      inspiringWoman: 'Maya Angelou, a poet, memoirist, and civil rights activist, who often found creative inspiration in the quiet hours of the night.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdQvOLqzNHSW',
      artist: {
        name: 'FKA Twigs',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/FKA_twigs_-_Ritual_Union_2014.jpg/800px-FKA_twigs_-_Ritual_Union_2014.jpg',
      },
    },
    {
      result: 'Sun Chaser',
      image: 'sunchaser.webp',
      description: 'You are drawn to light and positivity.',
      inspiringWoman: 'Greta Thunberg, a young climate activist who has mobilized millions around the world to demand action on climate change.',
      playlist: 'https://open.spotify.com/embed/playlist/1M4HRuhHptR24Ocs3HRfvO',
      artist: {
        name: 'Maggie Rogers',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Maggie_Rogers_2019.jpg/800px-Maggie_Rogers_2019.jpg',
      },
    },
    {
      result: 'Perfectionist',
      image: 'perfectionist.webp',
      description: 'You strive to be the best in everything you do.',
      inspiringWoman: 'Serena Williams, one of the greatest tennis players of all time, whose pursuit of excellence redefined the world of sports.',
      playlist: 'https://open.spotify.com/embed/playlist/2s8Bn8OGyJLjcpYEkxFfWF',
      artist: {
        name: 'Beyoncé',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Beyonce_-_The_Formaiton_World_Tour_-_2016.jpg/800px-Beyonce_-_The_Formaiton_World_Tour_-_2016.jpg',
      },
    },
    {
      result: 'Free Spirit',
      image: 'freespirit.webp',
      description: 'You follow your heart wherever it leads.',
      inspiringWoman: 'Zelda Fitzgerald, a writer and socialite of the Jazz Age, known for her creative talents and struggles against societal expectations.',
      playlist: 'https://open.spotify.com/embed/playlist/1ZvrtlXiYPmHalJWmj8VtC',
      artist: {
        name: 'Lana Del Rey',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Lana_Del_Rey_%40_SXSW_2019.jpg/800px-Lana_Del_Rey_%40_SXSW_2019.jpg',
      },
    },
    {
      result: 'Thinker',
      image: 'thinker.webp',
      description: 'You love pondering deep questions and solving problems.',
      inspiringWoman: 'Marie Curie, the first woman to win two Nobel Prizes, whose discoveries in radioactivity changed science forever.',
      playlist: 'https://open.spotify.com/embed/playlist/0Ver1JN2EzqOOsTP4ovQdA',
      artist: {
        name: 'St. Vincent',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/St._Vincent_2018.jpg/800px-St._Vincent_2018.jpg',
      },
    },
  ];
  