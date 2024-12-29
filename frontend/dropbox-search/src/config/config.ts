const env = process.env.NODE_ENV;

// window.location.hostname
// const config = {
//   // todo hardcoding the url for now for testing in render.com .. we can read this from env variable also
//   apiUrl:
//     env === "development"
//       ? process.env.REACT_APP_API_URL
//       : `https://<backend-url>.onrender.com`,
//   apiPort: env === "development" ? process.env.REACT_APP_API_PORT : "443",
// };

const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  apiPort: process.env.REACT_APP_API_PORT,
};
console.log(config);
export default config;
