const storageService = {};

// Save data to localStorage
storageService.setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving "${key}" to localStorage:`, error);
  }
};

// Get data from localStorage
storageService.getItem = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error reading "${key}" from localStorage:`, error);
    return null;
  }
};

// Remove item from localStorage
storageService.removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing "${key}" from localStorage:`, error);
  }
};

// Clear all localStorage
storageService.clearAll = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

export default storageService;
