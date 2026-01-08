interface Address {
  street: string;
  postNumber: number;
  city: string;
}

interface ResultsTableProps {
  results: Address[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  return (
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
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
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
  );
}
