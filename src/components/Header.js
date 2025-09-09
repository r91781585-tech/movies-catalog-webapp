import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo">🎬 Movies Catalog</h1>
          
          <div className="header-actions">
            {currentUser ? (
              <div className="user-menu">
                <span className="welcome-text">
                  Welcome, {currentUser.displayName || currentUser.email}
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-secondary"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <a href="/login" className="btn btn-primary">Sign In</a>
                <a href="/signup" className="btn btn-secondary">Sign Up</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;