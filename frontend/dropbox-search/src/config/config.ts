const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost',
  apiPort: process.env.REACT_APP_API_PORT || '3001',
};

console.log("config", config);

export default config;
