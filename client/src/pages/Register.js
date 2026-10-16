import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !password) {
      setError('Please fill all the fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      await register(fullName.trim(), username.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>DoubtConnect</h1>
        <h2>Create Account</h2>
        <p className="register-subtitle">Join DoubtConnect and start learning together</p>

        <form onSubmit={handleRegister}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label>Username</label>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: '#d93025', fontSize: '14px', marginTop: '8px' }}>{error}</p>}

          <button type="submit" disabled={busy}>
            {busy ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="register-bottom">
          <span>Already have an account?</span>
          <span className="text-link" onClick={() => navigate('/login')}>Login</span>
        </div>

        <div className="back-link" onClick={() => navigate('/')}>← Back to Home</div>
      </div>
    </div>
  );
}

export default Register;
