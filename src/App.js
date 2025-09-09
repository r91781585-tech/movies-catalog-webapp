import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import MovieSearch from './components/MovieSearch';
import MyLists from './components/MyLists';
import Auth from './components/Auth';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Navigation />
          
          <main className="main-content">
            <div className="container">
              <Routes>
                <Route path="/" element={<MovieSearch />} />
                <Route path="/my-lists" element={<MyLists />} />
                <Route path="/login" element={<Auth mode="login" />} />
                <Route path="/signup" element={<Auth mode="signup" />} />
              </Routes>
            </div>
          </main>
          
          <footer className="footer">
            <div className="container">
              <p>&copy; 2024 Movies Catalog. Powered by OMDb API & Firebase.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;