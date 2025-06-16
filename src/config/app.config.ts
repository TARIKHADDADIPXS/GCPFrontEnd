const appConfig = {
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/",
  node_env: process.env.REACT_APP_NODE_ENV || "production"
};

export default appConfig;