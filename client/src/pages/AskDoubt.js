import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { SUBJECTS } from '../constants';
import '../styles/AskDoubt.css';

function AskDoubt() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !subject || !description.trim()) {
      setError('Please fill all the fields.');
      return;
    }
    setBusy(true);
    try {
      const { question } = await api.askQuestion({ title, subject, description });
      navigate(`/questions/${question.id}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="ask-doubt-page">
      <div className="ask-doubt-box">
        <h1>Ask a Doubt</h1>
        <p>Share your question and get help from other learners.</p>

        <form onSubmit={handleSubmit}>
          <label>Question Title</label>
          <input
            type="text"
            placeholder="Enter your question title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Subject</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <label>Description</label>
          <textarea
            placeholder="Explain your doubt in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="6"
          ></textarea>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="post-doubt-btn" disabled={busy}>
            {busy ? 'Posting...' : 'Post Doubt'}
          </button>
        </form>

        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AskDoubt;
