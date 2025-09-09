import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MovieDetails from './MovieDetails';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const { currentUser } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
    ? movie.Poster 
    : '/placeholder-movie.png';

  return (
    <>
      <div className="movie-card">
        <div className="movie-poster">
          <img 
            src={posterUrl} 
            alt={movie.Title}
            onError={(e) => {
              e.target.src = '/placeholder-movie.png';
            }}
          />
        </div>
        
        <div className="movie-info">
          <h3 className="movie-title">{movie.Title}</h3>
          <div className="movie-meta">
            <span className="movie-year">{movie.Year}</span>
            <span className="movie-type">{movie.Type}</span>
          </div>
          
          <div className="movie-actions">
            <button 
              onClick={handleViewDetails}
              className="btn btn-primary btn-sm"
            >
              View Details
            </button>
            
            {!currentUser && (
              <p className="auth-prompt">
                <a href="/login">Sign in</a> to save movies
              </p>
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <MovieDetails 
          movie={movie} 
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
};

export default MovieCard;