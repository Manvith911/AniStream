const config = {
  serverUrl: import.meta.env.VITE_APP_SERVERURL || "https://animerealm-backend.onrender.com/api/v1",
  localUrl: import.meta.env.VITE_APP_LOCALURL,
  proxyUrl: import.meta.env.VITE_APP_PROXYURL,
};

export default config;
