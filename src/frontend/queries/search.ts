import { useEffect, useState } from "react";
import type adresses from "src/api/data/adresses.json";
import { useDebounce } from "../helpers/useDebounce";

function fetchSearch(searchTerm: string) {
  return fetch(`/search/${searchTerm}`).then(async (r) => {
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

  useEffect(() => {
    if (debouncedSearchTerm.length < 3) {
      setResults(() => []);
      return;
    }
    fetchSearch(debouncedSearchTerm).then((r) => setResults(() => r));
  }, [debouncedSearchTerm]);

  return { searchTerm, setSearchTerm, results } as const;
}
