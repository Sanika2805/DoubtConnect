import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const from = location.state?.from || '/dashboard';

  async function handleLogin(e) {
    e.preventDefault();
    if (username.trim() === '' || password === '') {
      setError('Please enter username and password.');
      return;
    }
    setBusy(true);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>DoubtConnect</h1>
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Login to continue to DoubtConnect</p>

        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={busy}>
            {busy ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-bottom">
          <span>Don't have an account?</span>
          <button type="button" className="text-button" onClick={() => navigate('/register')}>
            Sign Up
          </button>
        </div>

        <button type="button" className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default Login;
