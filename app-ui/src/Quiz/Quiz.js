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
  const [answers, setAnswers] = useState([]); // Array to store chosen indexes
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();

  const handleOptionClick = (index) => {
    // Store the chosen index in the answers array
    setAnswers((prevAnswers) => [...prevAnswers, index]);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setIsFinished(true);
    }
  };
  console.log("quiz " + answers);

  return (
    <div className="quiz-container">
      {!isFinished ? (
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
      ) : (
        <div className="quiz-finished">
          <h2>You’ve finished the quiz!</h2>
          <p>Your answers: {JSON.stringify(answers)}</p> {/* Display chosen indexes */}
          <button onClick={() => navigate('/')} className="back-button">
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
