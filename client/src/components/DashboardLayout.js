import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const links = [
  { to: '/dashboard', icon: '⌂', label: 'Dashboard' },
  { to: '/ask', icon: '?', label: 'Ask a Doubt' },
  { to: '/questions', icon: '▣', label: 'Questions' },
  { to: '/my-doubts', icon: '☷', label: 'My Doubts' },
  { to: '/profile', icon: '●', label: 'Profile' },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 800);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-navbar">
        <div className="navbar-left">
          <button className="menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="dashboard-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            DoubtConnect
          </div>
        </div>
        <div className="navbar-right">
          <span className="profile-name">{user.fullName}</span>
        </div>
      </header>

      <div className="dashboard-body">
        {sidebarOpen && (
          <aside className="sidebar">
            <div className="sidebar-title">Menu</div>

            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}
              >
                <span>{l.icon}</span>
                {l.label}
              </NavLink>
            ))}

            <div className="sidebar-divider"></div>

            <div className="sidebar-item logout-item" onClick={handleLogout}>
              <span>←</span>
              Logout
            </div>
          </aside>
        )}

        <main className={sidebarOpen ? 'dashboard-content' : 'dashboard-content full-width'}>
          {children}
        </main>
      </div>
    </div>
  );
}
