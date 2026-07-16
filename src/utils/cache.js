// Simple in-memory cache (no Redis)
const cache = {};

exports.cacheGet = async (key) => {
  const entry = cache[key];
  if (!entry) return null;
  if (entry.expiry && entry.expiry < Date.now()) {
    delete cache[key];
    return null;
  }
  return entry.value;
};

exports.cacheSet = async (key, value, ttl = 60) => {
  cache[key] = {
    value,
    expiry: Date.now() + ttl * 1000,
  };
};

exports.cacheDel = async (pattern) => {
  // For simplicity, delete all keys that start with the pattern
  const keys = Object.keys(cache);
  keys.forEach((key) => {
    if (key.startsWith(pattern.replace("*", ""))) {
      delete cache[key];
    }
  });
};
