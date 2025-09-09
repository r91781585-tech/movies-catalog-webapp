import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { currentUser } = useAuth();

  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-links">
          <a href="/" className="nav-link">
            🔍 Search Movies
          </a>
          
          {currentUser && (
            <a href="/my-lists" className="nav-link">
              📋 My Lists
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;