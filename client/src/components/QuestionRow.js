import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils';

// One question in a list (used on Dashboard, Questions and My Doubts).
export default function QuestionRow({ question, showStatus = false, children }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-question">
      <div className="question-main">
        <span className="subject-tag">{question.subject}</span>
        {showStatus && (
          <span className={`status-badge ${question.solved ? 'solved' : 'unsolved'}`}>
            {question.solved ? 'Solved' : 'Unsolved'}
          </span>
        )}
        <h3>{question.title}</h3>
        <p>{question.description.length > 140 ? question.description.slice(0, 140) + '...' : question.description}</p>
        <span className="question-user">
          Asked by {question.author.fullName} · {formatDate(question.createdAt)}
        </span>
      </div>

      <div className="question-info">
        <strong>{question.answerCount}</strong>
        <span>{question.answerCount === 1 ? 'Answer' : 'Answers'}</span>
        <button onClick={() => navigate(`/questions/${question.id}`)}>View</button>
        {children}
      </div>
    </div>
  );
}
