import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    // Pass function instead of value to useState for lazy initial state loading. Function runs ONLY on first render (not every render)
    // Performance: Reading from LocalStorage is slow, only do it once
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      //   window.localStorage - Access browser local storage. Stores data with no expiration date. Stores only strings.

      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value; // Get value to store by executing function or directly use value
      // instanceof - Checks if value is a function
      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      // JSON.stringify() - Convert object/array to JSON string
      // LocalStorage only stores strings, must stringify
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
