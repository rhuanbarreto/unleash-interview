import "./index.css";
import { useSearch } from "./queries/search";

export function App() {
  const { searchTerm, setSearchTerm, results } = useSearch();

  return (
    <div className="app">
      <div className="header">
        <h1>Street Address Search</h1>
        <p className="subtitle">Search for Norwegian street addresses</p>
      </div>

      <div className="search-container">
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="search"
          name="search"
          className="search-input"
          aria-label="Search for street addresses"
          placeholder="Type at least 3 characters to search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          autoFocus
        />
      </div>

      {searchTerm.length > 0 && searchTerm.length < 3 && (
        <div className="hint">
          Type at least 3 characters to start searching
        </div>
      )}

      {results.length > 0 && (
        <div className="results-container">
          <div className="results-header">
            <span className="results-count">
              Found {results.length}{" "}
              {results.length === 1 ? "address" : "addresses"}
            </span>
          </div>

          <div className="table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Street Name</th>
                  <th>Post Number</th>
                  <th>City</th>
                  <th>Map</th>
                </tr>
              </thead>
              <tbody>
                {results.map((address, index) => {
                  const mapsQuery = encodeURIComponent(
                    `${address.street}, ${address.postNumber} ${address.city}, Norway`
                  );
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

                  return (
                    <tr key={`${address.postNumber}-${address.street}-${index}`}>
                      <td className="street-cell">{address.street}</td>
                      <td className="post-number-cell">{address.postNumber}</td>
                      <td className="city-cell">{address.city}</td>
                      <td className="map-cell">
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="map-link"
                          aria-label={`Open ${address.street} on Google Maps`}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M8 14s6-4.686 6-8.5C14 3.015 11.314 1 8 1S2 3.015 2 5.5C2 9.314 8 14 8 14z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle
                              cx="8"
                              cy="5.5"
                              r="1.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                          View
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {searchTerm.length >= 3 && results.length === 0 && (
        <div className="no-results">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M24 16v12M24 32v.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p>No addresses found</p>
          <p className="no-results-hint">Try a different search term</p>
        </div>
      )}
    </div>
  );
}

export default App;
