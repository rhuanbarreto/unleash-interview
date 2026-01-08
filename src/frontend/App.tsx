import "./index.css";
import { useSearch } from "./queries/search";
import { SearchBar } from "./components/SearchBar";
import { SearchHint } from "./components/SearchHint";
import { ResultsTable } from "./components/ResultsTable";
import { NoResults } from "./components/NoResults";

export function App() {
  const { searchTerm, setSearchTerm, results } = useSearch();

  return (
    <div className="app">
      <div className="header">
        <h1>Street Address Search</h1>
        <p className="subtitle">Search for Norwegian street addresses</p>
      </div>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {searchTerm.length > 0 && searchTerm.length < 3 && <SearchHint />}

      {results.length > 0 && <ResultsTable results={results} />}

      {searchTerm.length >= 3 && results.length === 0 && <NoResults />}
    </div>
  );
}

export default App;
