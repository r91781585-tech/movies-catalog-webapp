import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMovieDetails } from '../services/omdbApi';
import { 
  getUserLists, 
  addMovieToList, 
  removeMovieFromList, 
  isMovieInList 
} from '../services/firebaseService';
import AddToListModal from './AddToListModal';
import './MovieDetails.css';

const MovieDetails = ({ movie, onClose }) => {
  const { currentUser } = useAuth();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLists, setUserLists] = useState([]);
  const [movieInLists, setMovieInLists] = useState({});
  const [showAddToListModal, setShowAddToListModal] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    if (currentUser) {
      fetchUserLists();
    }
  }, [movie.imdbID, currentUser]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const details = await getMovieDetails(movie.imdbID);
      setMovieDetails(details);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLists = async () => {
    try {
      const lists = await getUserLists(currentUser.uid);
      setUserLists(lists);
      
      // Check which lists contain this movie
      const listStatus = {};
      for (const list of lists) {
        const inList = await isMovieInList(currentUser.uid, list.id, movie.imdbID);
        listStatus[list.id] = inList;
      }
      setMovieInLists(listStatus);
    } catch (err) {
      console.error('Error fetching user lists:', err);
    }
  };

  const handleAddToList = async (listId) => {
    try {
      await addMovieToList(currentUser.uid, listId, movieDetails);
      setMovieInLists(prev => ({ ...prev, [listId]: true }));
      setShowAddToListModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveFromList = async (listId) => {
    try {
      await removeMovieFromList(currentUser.uid, listId, movie.imdbID);
      setMovieInLists(prev => ({ ...prev, [listId]: false }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-content">
          <div className="loading">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-content">
          <div className="error">
            <p>{error}</p>
            <button onClick={onClose} className="btn btn-secondary">Close</button>
          </div>
        </div>
      </div>
    );
  }

  const posterUrl = movieDetails.Poster && movieDetails.Poster !== 'N/A' 
    ? movieDetails.Poster 
    : '/placeholder-movie.png';

  return (
    <>
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-content movie-details-modal">
          <button className="close-btn" onClick={onClose}>×</button>
          
          <div className="movie-details-content">
            <div className="movie-details-poster">
              <img src={posterUrl} alt={movieDetails.Title} />
            </div>
            
            <div className="movie-details-info">
              <h1>{movieDetails.Title}</h1>
              
              <div className="movie-meta-details">
                <span className="year">{movieDetails.Year}</span>
                <span className="rated">{movieDetails.Rated}</span>
                <span className="runtime">{movieDetails.Runtime}</span>
              </div>
              
              <div className="movie-genre">
                <strong>Genre:</strong> {movieDetails.Genre}
              </div>
              
              <div className="movie-plot">
                <strong>Plot:</strong> {movieDetails.Plot}
              </div>
              
              <div className="movie-credits">
                <div><strong>Director:</strong> {movieDetails.Director}</div>
                <div><strong>Actors:</strong> {movieDetails.Actors}</div>
                <div><strong>Writer:</strong> {movieDetails.Writer}</div>
              </div>
              
              {movieDetails.imdbRating && movieDetails.imdbRating !== 'N/A' && (
                <div className="movie-rating">
                  <strong>IMDb Rating:</strong> {movieDetails.imdbRating}/10
                </div>
              )}
              
              {currentUser && (
                <div className="movie-actions-section">
                  <h3>My Lists</h3>
                  
                  {userLists.length > 0 ? (
                    <div className="lists-status">
                      {userLists.map(list => (
                        <div key={list.id} className="list-item">
                          <span className="list-name">{list.name}</span>
                          {movieInLists[list.id] ? (
                            <button
                              onClick={() => handleRemoveFromList(list.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddToList(list.id)}
                              className="btn btn-primary btn-sm"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No lists found. Create your first list!</p>
                  )}
                  
                  <button
                    onClick={() => setShowAddToListModal(true)}
                    className="btn btn-secondary"
                  >
                    Manage Lists
                  </button>
                </div>
              )}
              
              {!currentUser && (
                <div className="auth-prompt-section">
                  <p>
                    <a href="/login">Sign in</a> to add this movie to your lists
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showAddToListModal && (
        <AddToListModal
          movie={movieDetails}
          onClose={() => setShowAddToListModal(false)}
          onListUpdated={fetchUserLists}
        />
      )}
    </>
  );
};

export default MovieDetails;