import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { SUBJECTS } from '../constants';
import QuestionRow from '../components/QuestionRow';

function Questions() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [subject, setSubject] = useState('All');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Re-fetch (after a short pause while typing) whenever search / subject change.
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .getQuestions({ search, subject })
        .then((d) => {
          setQuestions(d.questions);
          setError('');
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, subject]);

  return (
    <>
      <div className="page-head">
        <p className="page-eyebrow">Community</p>
        <h1>All Questions</h1>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="All">All subjects</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <div className="empty-box">Loading...</div>
      ) : questions.length === 0 ? (
        <div className="empty-box">No questions found.</div>
      ) : (
        questions.map((q) => <QuestionRow key={q.id} question={q} showStatus />)
      )}
    </>
  );
}

export default Questions;
