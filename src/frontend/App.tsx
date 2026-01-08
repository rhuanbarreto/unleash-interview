import "./index.css";
import { useSearch } from "./queries/search";

export function App() {
  const { searchTerm, setSearchTerm, results } = useSearch();

  return (
    <div className="app">
      <h1>Address Search</h1>
      <input
        type="search"
        name="search"
        aria-label="Search"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        autoFocus
      />
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}

export default App;
