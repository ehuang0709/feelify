import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

const questions = [
  {
    question: 'What’s your favorite genre?',
    options: ['Pop', 'Rock', 'Jazz', 'Classical'],
  },
  {
    question: 'Where do you usually listen to music?',
    options: ['At home', 'At the gym', 'On a walk', 'At work'],
  },
  {
    question: 'What’s your go-to instrument sound?',
    options: ['Guitar', 'Piano', 'Drums', 'Violin'],
  },
];

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]); // Store chosen indexes
  const navigate = useNavigate();

  const handleOptionClick = (index) => {
    const newAnswers = [...answers, index]; // Store the latest answer

    // If it's the last question, navigate to QuizResult
    if (currentQuestion + 1 === questions.length) {
      navigate('/quiz-result', { state: { answers: newAnswers } });
    } else {
      // Otherwise, move to the next question
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-question">
        <h3>{questions[currentQuestion].question}</h3>
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)} // Pass the chosen index
            className="quiz-option-button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Quiz;
