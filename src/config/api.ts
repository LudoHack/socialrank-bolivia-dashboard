const API_URL = process.env.REACT_APP_API_URL || 'https://socialrank-bolivia-api-news.onrender.com/noticias/api';

export const config = {
  apiUrl: API_URL,
  endpoints: {
    news: `${API_URL}/news`,
    users: `${API_URL}/users`,
    auth: `${API_URL}/auth`,
    tags: `${API_URL}/tags`,
    comments: `${API_URL}/comments`,
    savedFilters: `${API_URL}/saved-filters`,
  }
};

export default config;
