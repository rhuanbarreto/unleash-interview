import { useEffect, useState } from "react";
import { SEARCH_DEBOUNCE_DELAY } from "../../config/constants";

export function useDebounce(value: string) {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, SEARCH_DEBOUNCE_DELAY);

    // Cleanup function: Cancel the timeout if value changes before the timeout fires
    return () => {
      clearTimeout(handler);
    };
  }, [value]); // Only re-run the effect if value changes

  return debouncedValue;
}
