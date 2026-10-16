import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import QuestionRow from '../components/QuestionRow';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ asked: 0, solved: 0, answersGiven: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.stats(), api.getQuestions({ limit: 5 })])
      .then(([s, q]) => {
        setStats(s);
        setRecent(q.questions);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/questions?search=${encodeURIComponent(search.trim())}`);
  }

  return (
    <>
      <section className="welcome-section">
        <div>
          <p className="welcome-small">Student Dashboard</p>
          <h1>Welcome, {user.fullName.split(' ')[0]}!</h1>
          <p className="welcome-text">
            Ask questions, share knowledge and help other students learn.
          </p>
        </div>
      </section>

      <div className="stats-row">
        <div className="stat-card">
          <strong>{stats.asked}</strong>
          <span>Doubts Asked</span>
        </div>
        <div className="stat-card">
          <strong>{stats.solved}</strong>
          <span>Doubts Solved</span>
        </div>
        <div className="stat-card">
          <strong>{stats.answersGiven}</strong>
          <span>Answers Given</span>
        </div>
      </div>

      <form className="search-box" onSubmit={handleSearch}>
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search questions, subjects or doubts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <section className="action-section">
        <div className="action-card ask-card">
          <div className="action-icon">?</div>
          <div className="action-content">
            <h2>Ask a Doubt</h2>
            <p>Stuck on a topic? Ask the community and get help from other students.</p>
            <button onClick={() => navigate('/ask')}>Ask Now →</button>
          </div>
        </div>

        <div className="action-card explore-card">
          <div className="action-icon">Q</div>
          <div className="action-content">
            <h2>Explore Questions</h2>
            <p>Browse questions shared by students and contribute your knowledge.</p>
            <button onClick={() => navigate('/questions')}>Explore →</button>
          </div>
        </div>
      </section>

      <section className="recent-section">
        <div className="section-heading">
          <div>
            <p>Community</p>
            <h2>Recent Questions</h2>
          </div>
          <button className="view-all-button" onClick={() => navigate('/questions')}>
            View All →
          </button>
        </div>

        {loading ? (
          <div className="empty-box">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="empty-box">No questions yet. Be the first to ask one!</div>
        ) : (
          recent.map((q) => <QuestionRow key={q.id} question={q} />)
        )}
      </section>
    </>
  );
}

export default Dashboard;
