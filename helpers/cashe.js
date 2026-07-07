export const setCache = (key, data) => {
  localStorage.setItem(
    key,
    JSON.stringify({
      data,
      savedAt: Date.now(),
    }),
  );
};

export const getCache = (key, maxTime) => {
  const cache = JSON.parse(localStorage.getItem(key));

  if (!cache) return null;

  const isExpired = Date.now() - cache.savedAt > maxTime;

  if (isExpired) {
    localStorage.removeItem(key);
    return null;
  }

  return cache.data;
}