import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserLists, getListItems, createList } from '../services/firebaseService';
import AddToListModal from './AddToListModal';
import './MyLists.css';

const MyLists = () => {
  const { currentUser } = useAuth();
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchLists();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedList) {
      fetchListItems(selectedList.id);
    }
  }, [selectedList]);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const userLists = await getUserLists(currentUser.uid);
      setLists(userLists);
      
      // Auto-select favorites list if available
      const favoritesList = userLists.find(list => list.isDefault);
      if (favoritesList && !selectedList) {
        setSelectedList(favoritesList);
      } else if (userLists.length > 0 && !selectedList) {
        setSelectedList(userLists[0]);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchListItems = async (listId) => {
    try {
      setItemsLoading(true);
      const items = await getListItems(currentUser.uid, listId);
      setListItems(items);
    } catch (error) {
      console.error('Error fetching list items:', error);
    } finally {
      setItemsLoading(false);
    }
  };

  const handleListSelect = (list) => {
    setSelectedList(list);
  };

  const handleListUpdated = () => {
    fetchLists();
    if (selectedList) {
      fetchListItems(selectedList.id);
    }
  };

  if (!currentUser) {
    return (
      <div className="my-lists-container">
        <div className="auth-required">
          <h2>Sign In Required</h2>
          <p>Please <a href="/login">sign in</a> to view your movie lists.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-lists-container">
        <div className="loading">Loading your lists...</div>
      </div>
    );
  }

  return (
    <div className="my-lists-container">
      <div className="my-lists-header">
        <h1>My Movie Lists</h1>
        <button
          onClick={() => setShowManageModal(true)}
          className="btn btn-primary"
        >
          Manage Lists
        </button>
      </div>

      <div className="my-lists-content">
        <div className="lists-sidebar">
          <h3>Your Lists</h3>
          {lists.length > 0 ? (
            <div className="lists-menu">
              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => handleListSelect(list)}
                  className={`list-menu-item ${
                    selectedList?.id === list.id ? 'active' : ''
                  }`}
                >
                  <span className="list-name">
                    {list.name}
                    {list.isDefault && <span className="default-badge">★</span>}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="no-lists">
              <p>No lists found.</p>
              <button
                onClick={() => setShowManageModal(true)}
                className="btn btn-secondary btn-sm"
              >
                Create Your First List
              </button>
            </div>
          )}
        </div>

        <div className="list-content">
          {selectedList ? (
            <>
              <div className="list-header">
                <h2>
                  {selectedList.name}
                  {selectedList.isDefault && <span className="default-indicator">★ Default</span>}
                </h2>
                <p className="list-count">
                  {listItems.length} {listItems.length === 1 ? 'movie' : 'movies'}
                </p>
              </div>

              {itemsLoading ? (
                <div className="loading">Loading movies...</div>
              ) : listItems.length > 0 ? (
                <div className="movies-grid">
                  {listItems.map(item => (
                    <div key={item.id} className="list-movie-card">
                      <div className="movie-poster">
                        <img
                          src={item.poster !== 'N/A' ? item.poster : '/placeholder-movie.png'}
                          alt={item.title}
                          onError={(e) => {
                            e.target.src = '/placeholder-movie.png';
                          }}
                        />
                      </div>
                      <div className="movie-info">
                        <h4 className="movie-title">{item.title}</h4>
                        <p className="movie-year">{item.year}</p>
                        <p className="movie-type">{item.type}</p>
                        {item.metadata?.imdbRating && item.metadata.imdbRating !== 'N/A' && (
                          <p className="movie-rating">⭐ {item.metadata.imdbRating}</p>
                        )}
                        <p className="added-date">
                          Added: {item.addedAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-list">
                  <h3>This list is empty</h3>
                  <p>Start adding movies by searching and clicking "View Details" on any movie.</p>
                  <a href="/" className="btn btn-primary">
                    Search Movies
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="no-list-selected">
              <h3>Select a list to view movies</h3>
              <p>Choose a list from the sidebar to see your saved movies.</p>
            </div>
          )}
        </div>
      </div>

      {showManageModal && (
        <AddToListModal
          onClose={() => setShowManageModal(false)}
          onListUpdated={handleListUpdated}
        />
      )}
    </div>
  );
};

export default MyLists;