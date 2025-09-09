import axios from 'axios';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

// Simple cache to reduce API calls
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const omdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY
  }
});

export const searchMovies = async (query, page = 1, type = '', year = '') => {
  const cacheKey = `search_${query}_${page}_${type}_${year}`;
  
  // Check cache first
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    cache.delete(cacheKey);
  }

  try {
    const params = {
      s: query,
      page: page
    };
    
    if (type) params.type = type;
    if (year) params.y = year;

    const response = await omdbApi.get('', { params });
    
    if (response.data.Response === 'True') {
      const result = {
        movies: response.data.Search,
        totalResults: parseInt(response.data.totalResults),
        currentPage: page
      };
      
      // Cache the result
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } else {
      throw new Error(response.data.Error || 'No movies found');
    }
  } catch (error) {
    throw new Error(error.response?.data?.Error || error.message || 'Failed to search movies');
  }
};

export const getMovieDetails = async (imdbID) => {
  const cacheKey = `details_${imdbID}`;
  
  // Check cache first
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    cache.delete(cacheKey);
  }

  try {
    const response = await omdbApi.get('', {
      params: { i: imdbID, plot: 'full' }
    });
    
    if (response.data.Response === 'True') {
      // Cache the result
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
      return response.data;
    } else {
      throw new Error(response.data.Error || 'Movie not found');
    }
  } catch (error) {
    throw new Error(error.response?.data?.Error || error.message || 'Failed to get movie details');
  }
};