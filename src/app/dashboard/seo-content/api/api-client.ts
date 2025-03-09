import axios from 'axios';

// Create an axios instance with the base URL dynamically set
const getApiClient = () => {
  const baseURL = typeof window !== 'undefined' ? window.location.origin : '';
  
  const instance = axios.create({
    baseURL,
    timeout: 60000, // 60 seconds timeout for longer SEO analysis
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Add request interceptor for debugging
  instance.interceptors.request.use(
    (config) => {
      if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
        console.log('API Request:', config);
      }
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor for debugging
  instance.interceptors.response.use(
    (response) => {
      if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
        console.log('API Response:', response);
      }
      return response;
    },
    (error) => {
      console.error('API Response Error:', error);
      return Promise.reject(error);
    }
  );
  
  return instance;
};

export default getApiClient; 