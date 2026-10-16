import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import QuestionRow from '../components/QuestionRow';

function MyDoubts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getQuestions({ author: user.id })
      .then((d) => setQuestions(d.questions))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user.id]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this doubt and all its answers?')) return;
    try {
      await api.deleteQuestion(id);
      setQuestions((qs) => qs.filter((q) => q.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-head">
        <p className="page-eyebrow">My Doubts</p>
        <h1>Doubts you have asked</h1>
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <div className="empty-box">Loading...</div>
      ) : questions.length === 0 ? (
        <div className="empty-box">
          You haven't asked any doubts yet.
          <br />
          <button className="primary-small" onClick={() => navigate('/ask')}>
            Ask your first doubt
          </button>
        </div>
      ) : (
        questions.map((q) => (
          <QuestionRow key={q.id} question={q} showStatus>
            <button className="small-btn danger" onClick={() => handleDelete(q.id)}>
              Delete
            </button>
          </QuestionRow>
        ))
      )}
    </>
  );
}

export default MyDoubts;
