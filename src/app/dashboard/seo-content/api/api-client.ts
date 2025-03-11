import axios from 'axios';

// Create an axios instance with the base URL dynamically set
const getApiClient = () => {
  const baseURL = typeof window !== 'undefined' ? window.location.origin : '';
  
  const instance = axios.create({
    baseURL,
    timeout: 60000, // 60 seconds timeout for longer SEO analysis
    headers: {
      'Content-Type': 'application/json',
      // Force real data in production
      'X-Force-Real-Data': 'true'
    },
  });
  
  // Add request interceptor for debugging
  instance.interceptors.request.use(
    (config) => {
      console.log('API Request to:', config.url);
      
      // Add noFallback parameter to analyze-seo requests to force real data
      if (config.url?.includes('analyze-seo')) {
        config.params = {
          ...config.params,
          noFallback: true
        };
        
        // For debugging purposes, add a timestamp to avoid caching
        if (!config.url.includes('?')) {
          config.url += '?';
        } else {
          config.url += '&';
        }
        config.url += `t=${Date.now()}`;
        
        console.log('📊 SEO Analysis request with forced real data');
      }
      
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
      // Check if we got a warning about mock data
      if (response.data?.warning) {
        console.warn('⚠️ API returned warning:', response.data.warning);
      }
      
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