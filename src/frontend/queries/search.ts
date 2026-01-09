import { useEffect, useState } from "react";
import type adresses from "src/api/data/adresses.json";
import { useDebounce } from "../helpers/useDebounce";
import { SEARCH_MIN_LENGTH } from "../../config/constants";

function fetchSearch(searchTerm: string) {
  return fetch(`/search/${encodeURIComponent(searchTerm)}`).then(async (r) => {
    if (!r.ok) {
      const content = await r.text();
      throw new Error(content);
    }
    return r.json() as Promise<typeof adresses>;
  });
}

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [results, setResults] = useState<
    Awaited<ReturnType<typeof fetchSearch>>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    // Reset error when search term changes
    setError(() => undefined);

    if (debouncedSearchTerm.length < SEARCH_MIN_LENGTH) {
      setResults(() => []);
      setIsLoading(() => false);
      return;
    }

    // Start loading
    setIsLoading(() => true);

    fetchSearch(debouncedSearchTerm)
      .then((r) => {
        setResults(() => r);
        setError(() => undefined);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setResults(() => []);
        setError(() =>
          err instanceof Error
            ? err.message
            : "An error occurred while searching"
        );
      })
      .finally(() => {
        setIsLoading(() => false);
      });
  }, [debouncedSearchTerm]);

  return { searchTerm, setSearchTerm, results, isLoading, error } as const;
}
