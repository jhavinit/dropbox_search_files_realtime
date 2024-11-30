const env = process.env.NODE_ENV;

// window.location.hostname
const config = {
  apiUrl: env === 'development' ? process.env.REACT_APP_API_URL : `https://borneo-test-api.onrender.com`,
  apiPort: env === 'development' ? process.env.REACT_APP_API_PORT : '443',  
};

console.log("config", config);

export default config;
