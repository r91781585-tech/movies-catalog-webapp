import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserLists, 
  createList, 
  updateList, 
  deleteList,
  addMovieToList,
  removeMovieFromList,
  isMovieInList
} from '../services/firebaseService';
import './AddToListModal.css';

const AddToListModal = ({ movie, onClose, onListUpdated }) => {
  const { currentUser } = useAuth();
  const [lists, setLists] = useState([]);
  const [movieInLists, setMovieInLists] = useState({});
  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState(null);
  const [editListName, setEditListName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const userLists = await getUserLists(currentUser.uid);
      setLists(userLists);
      
      // Check which lists contain this movie
      const listStatus = {};
      for (const list of userLists) {
        const inList = await isMovieInList(currentUser.uid, list.id, movie.imdbID);
        listStatus[list.id] = inList;
      }
      setMovieInLists(listStatus);
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      await createList(currentUser.uid, newListName.trim());
      setNewListName('');
      await fetchLists();
      onListUpdated && onListUpdated();
    } catch (error) {
      alert('Error creating list: ' + error.message);
    }
  };

  const handleUpdateList = async (listId) => {
    if (!editListName.trim()) return;

    try {
      await updateList(currentUser.uid, listId, { name: editListName.trim() });
      setEditingList(null);
      setEditListName('');
      await fetchLists();
      onListUpdated && onListUpdated();
    } catch (error) {
      alert('Error updating list: ' + error.message);
    }
  };

  const handleDeleteList = async (listId, listName) => {
    if (window.confirm(`Are you sure you want to delete "${listName}"? This will remove all movies from this list.`)) {
      try {
        await deleteList(currentUser.uid, listId);
        await fetchLists();
        onListUpdated && onListUpdated();
      } catch (error) {
        alert('Error deleting list: ' + error.message);
      }
    }
  };

  const handleToggleMovie = async (listId) => {
    try {
      if (movieInLists[listId]) {
        await removeMovieFromList(currentUser.uid, listId, movie.imdbID);
        setMovieInLists(prev => ({ ...prev, [listId]: false }));
      } else {
        await addMovieToList(currentUser.uid, listId, movie);
        setMovieInLists(prev => ({ ...prev, [listId]: true }));
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const startEditing = (list) => {
    setEditingList(list.id);
    setEditListName(list.name);
  };

  const cancelEditing = () => {
    setEditingList(null);
    setEditListName('');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content add-to-list-modal">
        <div className="modal-header">
          <h2>Manage Lists</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {movie && (
            <div className="movie-info-header">
              <img 
                src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.png'} 
                alt={movie.Title}
                className="movie-thumbnail"
              />
              <div>
                <h3>{movie.Title}</h3>
                <p>{movie.Year}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading">Loading lists...</div>
          ) : (
            <>
              <div className="lists-section">
                <h3>Your Lists</h3>
                {lists.length > 0 ? (
                  <div className="lists-container">
                    {lists.map(list => (
                      <div key={list.id} className="list-item-detailed">
                        <div className="list-info">
                          {editingList === list.id ? (
                            <div className="edit-list-form">
                              <input
                                type="text"
                                value={editListName}
                                onChange={(e) => setEditListName(e.target.value)}
                                className="form-control"
                                autoFocus
                              />
                              <div className="edit-actions">
                                <button
                                  onClick={() => handleUpdateList(list.id)}
                                  className="btn btn-primary btn-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="btn btn-secondary btn-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="list-name">
                                {list.name}
                                {list.isDefault && <span className="default-badge">Default</span>}
                              </span>
                              <div className="list-actions">
                                {movie && (
                                  <button
                                    onClick={() => handleToggleMovie(list.id)}
                                    className={`btn btn-sm ${
                                      movieInLists[list.id] ? 'btn-danger' : 'btn-primary'
                                    }`}
                                  >
                                    {movieInLists[list.id] ? 'Remove' : 'Add'}
                                  </button>
                                )}
                                <button
                                  onClick={() => startEditing(list)}
                                  className="btn btn-secondary btn-sm"
                                >
                                  Edit
                                </button>
                                {!list.isDefault && (
                                  <button
                                    onClick={() => handleDeleteList(list.id, list.name)}
                                    className="btn btn-danger btn-sm"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No lists found.</p>
                )}
              </div>

              <div className="create-list-section">
                <h3>Create New List</h3>
                <form onSubmit={handleCreateList} className="create-list-form">
                  <div className="form-group">
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Enter list name (e.g., Watch Later, Classics)"
                      className="form-control"
                      maxLength={50}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Create List
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToListModal;