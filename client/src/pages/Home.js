import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { plural } from '../utils';
import '../styles/Home.css';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getQuestions({ limit: 3 })
      .then((d) => setRecent(d.questions))
      .catch(() => setRecent([]))
      .finally(() => setLoading(false));
  }, []);

  const goToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Logged-in users go straight to the page; others are asked to log in first.
  const goTo = (path) => navigate(user ? path : '/login', { state: { from: path } });

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="logo">DoubtConnect</div>

        <div className="nav-links">
          <span className="nav-link" onClick={() => goToSection('home-section')}>Home</span>
          <span className="nav-link" onClick={() => goToSection('questions-section')}>Questions</span>
          <span className="nav-link" onClick={() => goToSection('about-section')}>About</span>

          {user ? (
            <button className="login-nav-button" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          ) : (
            <button className="login-nav-button" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
        </div>
      </nav>

      <section id="home-section" className="hero-section">
        <div className="hero-content">
          <h1>
            Clear Your Doubts.
            <br />
            Learn Together.
          </h1>
          <p>
            DoubtConnect is a collaborative academic platform where students can ask
            questions, share knowledge and learn together.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => goTo('/ask')}>Ask a Doubt</button>
            <button className="secondary-btn" onClick={() => goToSection('questions-section')}>
              Explore Questions
            </button>
          </div>
        </div>
      </section>

      <section id="questions-section" className="questions-section">
        <h2>Recent Questions</h2>

        {loading ? (
          <p className="home-note">Loading questions...</p>
        ) : recent.length === 0 ? (
          <p className="home-note">No questions yet. Be the first to ask a doubt!</p>
        ) : (
          <div className="question-cards">
            {recent.map((q) => (
              <div
                key={q.id}
                className="question-card"
                style={{ cursor: 'pointer' }}
                onClick={() => goTo(`/questions/${q.id}`)}
              >
                <span>{q.subject}</span>
                <h3>{q.title}</h3>
                <p>Asked by {q.author.fullName}</p>
                <strong>{plural(q.answerCount, 'Answer')}</strong>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="about-section" className="how-section">
        <h2>How DoubtConnect Works</h2>
        <div className="how-cards">
          <div className="how-card">
            <h3>Ask</h3>
            <p>Post your academic doubts with the relevant subject.</p>
          </div>
          <div className="how-card">
            <h3>Connect</h3>
            <p>View questions and answers shared by other students.</p>
          </div>
          <div className="how-card">
            <h3>Learn</h3>
            <p>Get answers and improve your understanding.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>DoubtConnect. Learn Together, Grow Together.</p>
      </footer>
    </div>
  );
}

export default Home;
