import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDate, plural } from '../utils';

function QuestionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getQuestion(id)
      .then((d) => setQuestion(d.question))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAnswer(e) {
    e.preventDefault();
    if (!answerText.trim()) {
      setError('Please write your answer first.');
      return;
    }
    setBusy(true);
    try {
      const d = await api.addAnswer(id, answerText);
      setQuestion(d.question);
      setAnswerText('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  async function handleDeleteAnswer(answerId) {
    if (!window.confirm('Delete this answer?')) return;
    try {
      const d = await api.deleteAnswer(id, answerId);
      setQuestion(d.question);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteQuestion() {
    if (!window.confirm('Delete this doubt and all its answers?')) return;
    try {
      await api.deleteQuestion(id);
      navigate('/my-doubts');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="empty-box">Loading...</div>;
  if (!question) {
    return (
      <div className="empty-box">
        {error || 'Question not found.'}
        <br />
        <button className="small-btn" onClick={() => navigate('/questions')}>
          Back to Questions
        </button>
      </div>
    );
  }

  const isOwner = question.author.id === user.id;

  return (
    <>
      <button className="small-btn ghost" onClick={() => navigate(-1)}>← Back</button>

      <div className="qd-card">
        <span className="subject-tag">{question.subject}</span>
        <h1 className="qd-title">{question.title}</h1>
        <p className="qd-meta">
          Asked by <strong>{question.author.fullName}</strong> · {formatDate(question.createdAt)} ·{' '}
          {plural(question.answerCount, 'answer')}
        </p>
        <p className="qd-desc">{question.description}</p>

        {isOwner && (
          <button className="small-btn danger" onClick={handleDeleteQuestion}>
            Delete this doubt
          </button>
        )}
      </div>

      <h2 className="qd-answers-title">Answers ({question.answerCount})</h2>

      {question.answers.length === 0 ? (
        <div className="empty-box">No answers yet. Be the first to help!</div>
      ) : (
        question.answers.map((a) => (
          <div key={a.id} className="answer-card">
            <div className="answer-top">
              <div className="answer-avatar">{a.author.fullName.charAt(0).toUpperCase()}</div>
              <div>
                <strong>{a.author.fullName}</strong>
                <span className="answer-date">{formatDate(a.createdAt)}</span>
              </div>
              {a.author.id === user.id && (
                <button className="small-btn danger push-right" onClick={() => handleDeleteAnswer(a.id)}>
                  Delete
                </button>
              )}
            </div>
            <p>{a.content}</p>
          </div>
        ))
      )}

      <form className="answer-form" onSubmit={handleAnswer}>
        <h3>Your Answer</h3>
        <textarea
          rows="5"
          placeholder="Share how you would explain this..."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary-small" disabled={busy}>
          {busy ? 'Posting...' : 'Post Answer'}
        </button>
      </form>
    </>
  );
}

export default QuestionDetail;
