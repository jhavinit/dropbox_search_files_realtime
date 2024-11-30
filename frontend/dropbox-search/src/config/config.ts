const env = process.env.NODE_ENV;

const config = {
  // apiUrl: process.env.REACT_APP_API_URL || 'http://localhost',
  // apiPort: process.env.REACT_APP_API_PORT || '3001',

  apiUrl: env == 'development' ? 'http://localhost' : `http://${window.location.hostname}`,
  apiPort: '3001',  
};

console.log("config", config);

export default config;
