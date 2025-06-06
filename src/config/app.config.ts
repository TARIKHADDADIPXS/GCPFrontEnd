const appConfig = {
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api",
};

export default appConfig;