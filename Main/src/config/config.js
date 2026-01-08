// API Configuration
// In production, set REACT_APP_API_URL environment variable
// In development, defaults to localhost:4000
export const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Helper function to build API URLs
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${apiBaseUrl}/${cleanEndpoint}`;
};