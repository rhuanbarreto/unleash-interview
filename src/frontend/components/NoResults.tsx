export function NoResults() {
  return (
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
  );
}
