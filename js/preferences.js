function storageUnavailable(error) {
  if (error.name !== "SecurityError" && error.name !== "QuotaExceededError") throw error;
  console.warn("CityCore Admin: browser preferences cannot be persisted; continuing for this page.", error);
}

export function readPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    storageUnavailable(error);
    return null;
  }
}

export function writePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    storageUnavailable(error);
  }
}
