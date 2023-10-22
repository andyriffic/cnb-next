export type PlayerLocalStorageSettings = {
  playerId: string;
};

const LOCAL_STORAGE_PLAYER_SETTINGS_KEY = "cnb-player-settings";

export function setPlayerLocalStorageSettings(
  settings: PlayerLocalStorageSettings
) {
  setLocalStorage(LOCAL_STORAGE_PLAYER_SETTINGS_KEY, settings);
}

export function getPlayerLocalStorageSettings(): PlayerLocalStorageSettings | null {
  return getLocalStorage(LOCAL_STORAGE_PLAYER_SETTINGS_KEY);
}

export function clearAllPlayerSettings() {
  clearLocalStorage(LOCAL_STORAGE_PLAYER_SETTINGS_KEY);
}

// Save an object of type T to localStorage
function setLocalStorage<T>(key: string, data: T): void {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

// Retrieve an object of type T from localStorage
function getLocalStorage<T>(key: string): T | null {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error("Error retrieving from localStorage:", error);
    return null;
  }
}

// Clear the data from localStorage
function clearLocalStorage(key: string): void {
  localStorage.removeItem(key);
}
