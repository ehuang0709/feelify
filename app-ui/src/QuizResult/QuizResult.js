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
        <p><strong>Advice:</strong> {result.advice}</p>
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
      description: 'Adventure flows through your veins, igniting a passion for exploration and risk-taking. You love challenging the status quo, exploring the unknown, and embracing life with curiosity and courage.',
      advice: 'Embrace new challenges, but remember to pause and reflect on the journey. Balance excitement with preparation, and don’t hesitate to seek help when needed. Stay open to unexpected paths—they often lead to the most memorable experiences.',
      playlist: 'https://open.spotify.com/embed/playlist/3xrbwOJGdSFy9X05euzlpa',
      image: 'adventurer.webp',
    },
    {
      result: 'Dreamer',
      description: 'You live in your world of creativity and wonder, always imagining possibilities beyond the present. You embrace dreams as a tool for personal growth and social change.',
      advice: 'Make time to ground your ideas into reality. Use practical steps to transform your dreams into tangible actions. Surround yourself with people who support your creativity, and don’t fear sharing your vision with the world.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWSiZVO2J6WeI',
      image: 'dreamer.webp',
    },
    {
      result: 'Explorer',
      description: 'You love discovering the unknown and embarking on new experiences. Your inquisitive nature pushes you to learn and expand your horizons.',
      advice: 'Explore with both curiosity and mindfulness. While diving into new places and ideas, take time to appreciate the present moment. Document your discoveries and share your experiences with others—they may spark someone else’s adventure.',
      playlist: 'https://open.spotify.com/embed/playlist/3ecmVHxXUkDcI90rBup8oT',
      image: 'explorer.webp',
    },
    {
      result: 'Romantic',
      description: 'Guided by emotion, you experience life deeply. Love and connection are central to your values, and you find beauty in vulnerability.',
      advice: 'Embrace vulnerability, but maintain a sense of self-identity. Remember that love takes many forms, and nurturing your relationships is just as important as loving yourself. Celebrate the beauty in everyday moments.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX7rOY2tZUw1k',
      image: 'romantic.webp',
    },
    {
      result: 'Visionary',
      description: 'You have a knack for bold ideas and inspire others to see the world from new perspectives. Vision drives your actions, and you lead change.',
      advice: 'Focus on turning your ideas into action. Collaboration is key—invite others into your vision and be open to feedback. Don’t let setbacks discourage you; even small progress can have a lasting impact.',
      playlist: 'https://open.spotify.com/embed/playlist/4r5uW1tgqNv5Rp6CPH4pcN',
      image: 'visionary.webp',
    },
    {
      result: 'Night Owl',
      description: 'Your best ideas and inspirations come alive at night, when creativity flourishes in quiet moments.',
      advice: 'Embrace your unique rhythm, but ensure you get rest when needed. Use nighttime creativity to your advantage by creating routines that let ideas flow. Consider balancing solo creative moments with social connection during the day.',
      playlist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdQvOLqzNHSW',
      image: 'nightowl.webp',
    },
    {
      result: 'Sun Chaser',
      description: 'You are drawn to positivity, light, and joy. Optimism is your guide, and you inspire others to chase their happiness.',
      advice: 'Spread positivity, but allow yourself to experience all emotions fully. Even during difficult times, your optimism can uplift others. Take time for self-care to keep your light shining bright.',
      playlist: 'https://open.spotify.com/embed/playlist/1M4HRuhHptR24Ocs3HRfvO',
      image: 'sunchaser.webp',
    },
    {
      result: 'Perfectionist',
      description: 'You are determined to excel in everything you do, holding yourself to the highest standards.',
      advice: 'Pursue excellence without sacrificing well-being. It’s okay to accept imperfection in some areas. Set realistic goals and celebrate small victories along the way. Don’t be too hard on yourself—rest is a part of the process.',
      playlist: 'https://open.spotify.com/embed/playlist/2s8Bn8OGyJLjcpYEkxFfWF',
      image: 'perfectionist.webp',
    },
    {
      result: 'Free Spirit',
      description: 'You follow your heart wherever it leads, living life on your own terms. Freedom and authenticity are your guiding principles.',
      advice: 'Follow your heart while also cultivating consistency. It’s okay to change course, but try to create routines that help you stay grounded. Surround yourself with people who encourage your freedom, and be kind to those who think differently.',
      playlist: 'https://open.spotify.com/embed/playlist/1ZvrtlXiYPmHalJWmj8VtC',
      image: 'freespirit.webp',
    },
    {
      result: 'Thinker',
      description: 'Your mind is always working, seeking answers to life’s deep questions. You thrive on intellectual pursuits and problem-solving.',
      advice: 'Use your curiosity to solve practical challenges as well. Balance reflection with action, and don’t hesitate to seek perspectives outside your own. Share your insights with others—they may benefit from your thoughtful approach.',
      playlist: 'https://open.spotify.com/embed/playlist/0Ver1JN2EzqOOsTP4ovQdA',
      image: 'thinker.webp',
    },
  ];
  