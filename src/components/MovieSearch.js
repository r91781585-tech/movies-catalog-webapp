import React, { useState, useEffect } from 'react';
import { searchMovies } from '../services/omdbApi';
import MovieCard from './MovieCard';
import './MovieSearch.css';

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    type: '',
    year: ''
  });

  const handleSearch = async (searchQuery = query, page = 1, resetResults = true) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await searchMovies(searchQuery, page, filters.type, filters.year);
      
      if (resetResults) {
        setMovies(result.movies);
      } else {
        setMovies(prev => [...prev, ...result.movies]);
      }
      
      setTotalResults(result.totalResults);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      if (resetResults) {
        setMovies([]);
        setTotalResults(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    handleSearch(query, 1, true);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    handleSearch(query, nextPage, false);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Re-search when filters change
  useEffect(() => {
    if (query && movies.length > 0) {
      setCurrentPage(1);
      handleSearch(query, 1, true);
    }
  }, [filters]);

  const hasMoreResults = movies.length < totalResults;

  return (
    <div className="movie-search">
      <div className="search-section">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies, TV shows, episodes..."
              className="form-control search-input"
            />
            <button 
              type="submit" 
              className="btn btn-primary search-btn"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        <div className="filters">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="form-control filter-select"
          >
            <option value="">All Types</option>
            <option value="movie">Movies</option>
            <option value="series">TV Series</option>
            <option value="episode">Episodes</option>
          </select>

          <input
            type="number"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            placeholder="Year"
            className="form-control filter-input"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>
      </div>

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {movies.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h2>Search Results</h2>
            <p>{totalResults} results found</p>
          </div>

          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={`${movie.imdbID}-${currentPage}`} movie={movie} />
            ))}
          </div>

          {hasMoreResults && (
            <div className="load-more-section">
              <button
                onClick={handleLoadMore}
                className="btn btn-secondary"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}

      {!loading && !error && movies.length === 0 && query && (
        <div className="no-results">
          <p>No movies found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;