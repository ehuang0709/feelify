import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

const questions = [
    {
        question: 'If colors had a taste, which one would be the sweetest?',
        options: ['Red', 'Blue', 'Yellow', 'Green'],
      },
      {
        question: 'If memories were physical places, which one would you visit most often?',
        options: ['A childhood home', 'A favorite vacation spot', 'A quiet park', 'A bustling city'],
      },
      {
        question: 'Which texture feels the most comforting to you?',
        options: ['Silk', 'Wool', 'Wood', 'Stone'],
      },
    {
        question: 'Which value do you strive to embody the most?',
        options: ['Honesty', 'Kindness', 'Courage', 'Patience'],
    },
    {
        question: 'What form of connection feels the most meaningful to you?',
        options: [
            'A deep conversation with a friend',
            'Creating something with others',
            'Spending time in silence together',
            'Receiving a thoughtful gesture or gift',
        ],
    },
    {
        question: 'Which season of life do you feel most drawn to?',
        options: [
          'The excitement of beginnings',
          'The growth of the middle',
          'The reflection of endings',
          'The anticipation of what’s next',
        ],
      },
    {
        question: 'Which aspect of the future excites you the most?',
        options: [
            'Personal growth and transformation',
            'Technological advancements',
            'New relationships and connections',
            'Opportunities for travel and adventure',
        ],
    },

];
function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const navigate = useNavigate();

    const handleOptionClick = (index) => {
        const newAnswers = [...answers, index];

        if (currentQuestion + 1 === questions.length) {
            navigate('/quiz-result', { state: { answers: newAnswers } });
        } else {
            setAnswers(newAnswers);
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const progress = ((currentQuestion) / questions.length) * 100;

    return (
        <div className="quiz-container">
            <div className="quiz-question">
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
                <h3>{questions[currentQuestion].question}</h3>
                {questions[currentQuestion].options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(index)}
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
