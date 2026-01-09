import "./index.css";
import { useSearch } from "./queries/search";
import { SearchBar } from "./components/SearchBar";
import { SearchHint } from "./components/SearchHint";
import { ResultsTable } from "./components/ResultsTable";
import { NoResults } from "./components/NoResults";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { SEARCH_MIN_LENGTH } from "../config/constants";

export function App() {
  const { searchTerm, setSearchTerm, results, isLoading, error } = useSearch();

  return (
    <div className="app">
      <div className="header">
        <h1>Street Address Search</h1>
        <p className="subtitle">Search for Norwegian street addresses</p>
      </div>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {searchTerm.length > 0 && searchTerm.length < SEARCH_MIN_LENGTH && (
        <SearchHint />
      )}

      {isLoading && <LoadingState />}

      {error && !isLoading && <ErrorState message={error} />}

      {!isLoading && !error && results.length > 0 && (
        <ResultsTable results={results} />
      )}

      {!isLoading &&
        !error &&
        searchTerm.length >= SEARCH_MIN_LENGTH &&
        results.length === 0 && <NoResults />}
    </div>
  );
}

export default App;
