// src/api/config.js
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  'http://localhost:8000'; // dev fallback

export default API_BASE;
