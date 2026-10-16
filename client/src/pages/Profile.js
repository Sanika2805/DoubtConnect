import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils';

function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [stats, setStats] = useState({ asked: 0, solved: 0, answersGiven: 0 });
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.stats().then(setStats).catch(() => {});
  }, []);

  function startEdit() {
    setForm({
      fullName: user.fullName,
      email: user.email || '',
      course: user.course || '',
      division: user.division || '',
    });
    setError('');
    setEditing(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      await updateProfile(form);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-head">
        <p className="page-eyebrow">Profile</p>
        <h1>Your profile</h1>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">{user.fullName.charAt(0).toUpperCase()}</div>

        {!editing ? (
          <div className="profile-details">
            <div className="profile-row"><span>Name</span><strong>{user.fullName}</strong></div>
            <div className="profile-row"><span>Username</span><strong>{user.username}</strong></div>
            <div className="profile-row"><span>Email</span><strong>{user.email || '-'}</strong></div>
            <div className="profile-row"><span>Course</span><strong>{user.course || '-'}</strong></div>
            <div className="profile-row"><span>Division</span><strong>{user.division || '-'}</strong></div>
            <div className="profile-row"><span>Member since</span><strong>{formatDate(user.createdAt)}</strong></div>
            <div className="profile-row"><span>Doubts asked</span><strong>{stats.asked}</strong></div>
            <div className="profile-row"><span>Doubts solved</span><strong>{stats.solved}</strong></div>
            <div className="profile-row"><span>Answers given</span><strong>{stats.answersGiven}</strong></div>

            <button className="primary-small" onClick={startEdit}>Edit Profile</button>
            {saved && <p className="form-success">Profile updated.</p>}
          </div>
        ) : (
          <form className="profile-details" onSubmit={handleSave}>
            <label className="pf-label">Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} />
            <label className="pf-label">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@college.edu" />
            <label className="pf-label">Course</label>
            <input name="course" value={form.course} onChange={handleChange} placeholder="e.g. B.Tech CSE" />
            <label className="pf-label">Division</label>
            <input name="division" value={form.division} onChange={handleChange} placeholder="e.g. C" />

            {error && <p className="form-error">{error}</p>}

            <div className="pf-actions">
              <button type="submit" className="primary-small">Save</button>
              <button type="button" className="small-btn ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default Profile;
