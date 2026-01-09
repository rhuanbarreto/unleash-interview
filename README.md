# Norwegian Street Address Search

A high-performance web application for searching Norwegian street addresses with real-time search capabilities and interactive map integration. Built as part of the Unleash technical interview.

**🚀 Live Demo**: [https://unleash.barreto.work/](https://unleash.barreto.work/) (deployed on Railway)

## Overview

This application provides a fast and intuitive interface for searching through Norwegian addresses. It uses a Trie-based search algorithm for efficient prefix matching across street names, postal codes, and cities. The application features a React-based frontend with a Bun-powered backend server.

### Key Features

- **Real-time Search**: Instant search results with debounced input for optimal performance
- **Multi-field Search**: Search across street names, postal codes, and city names simultaneously
- **Minimum Search Length**: Requires at least 3 characters for search activation to ensure relevant results
- **Interactive Maps**: Direct integration with Google Maps for each search result
- **Case-insensitive**: Search works regardless of input casing
- **Responsive Design**: Clean, modern UI that works across different screen sizes
- **Hot Module Replacement (HMR)**: Fast development experience with instant updates

## Tech Stack

### Runtime & Build Tools

- **[Bun](https://bun.sh)** - Fast all-in-one JavaScript runtime (v1.3.5+)
- Built-in bundler, test runner, and package manager

### Frontend

- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **CSS** - Custom styling with modern CSS features

### Backend

- **Bun.serve()** - High-performance HTTP server
- **trie-search** - Efficient prefix-based search algorithm

### Development

- **TypeScript** - Strict type checking enabled
- **Bun Test** - Fast, built-in test runner
- **Hot Module Replacement** - Development server with instant updates

## Project Structure

```
unleash-interview/
├── src/
│   ├── index.ts                    # Main server entry point
│   ├── config/
│   │   └── constants.ts            # Application constants
│   ├── middleware/
│   │   ├── rateLimit.ts            # Rate limiting middleware
│   │   └── logger.ts               # Structured logging utility
│   ├── api/
│   │   ├── data/
│   │   │   └── adresses.json       # Norwegian address database
│   │   ├── searchService.ts        # Core search logic with Trie implementation
│   │   └── searchService.test.ts   # Comprehensive test suite
│   └── frontend/
│       ├── index.html              # HTML entry point
│       ├── index.tsx               # React root component
│       ├── index.css               # Global styles
│       ├── App.tsx                 # Main App component
│       ├── components/
│       │   ├── SearchBar.tsx       # Search input component
│       │   ├── SearchHint.tsx      # Minimum character hint
│       │   ├── ResultsTable.tsx    # Search results display
│       │   ├── NoResults.tsx       # Empty state component
│       │   ├── LoadingState.tsx    # Loading indicator
│       │   ├── ErrorState.tsx      # Error message display
│       │   └── ErrorBoundary.tsx   # React error boundary
│       ├── queries/
│       │   └── search.ts           # Search API hook with error handling
│       └── helpers/
│           └── useDebounce.ts      # Debounce utility hook
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── bun-env.d.ts                    # Bun environment types
├── CLAUDE.md                       # Project-specific instructions for AI
└── README.md                       # This file
```

### Architecture Details

#### Backend (`src/`)

- **`index.ts`**: Configures the Bun server with routes and development features

  - Serves the frontend HTML
  - Exposes `/search/:term` API endpoint with input sanitization and rate limiting
  - Exposes `/health` endpoint for monitoring
  - Includes error handling and structured logging
  - Enables HMR in development mode

- **`config/constants.ts`**: Application-wide constants

  - Search configuration (min/max length, debounce delay)
  - Rate limiting settings

- **`middleware/`**: Production-ready middleware

  - **`rateLimit.ts`**: IP-based rate limiting (100 req/min)
  - **`logger.ts`**: Structured JSON logging with timestamps

- **`api/searchService.ts`**: Core search functionality
  - Initializes a Trie data structure with Norwegian addresses
  - Indexes on street, postNumber, and city fields
  - Returns up to 20 results per query
  - Enforces minimum 3-character search length

#### Frontend (`src/frontend/`)

- **Component Architecture**: Modular, reusable React components
  - **`ErrorBoundary.tsx`**: Catches and handles React runtime errors
  - **`LoadingState.tsx`**: Visual feedback during API requests
  - **`ErrorState.tsx`**: User-friendly error messages
- **State Management**: React hooks with custom search hook
- **API Integration**: Fetch-based communication with error handling
- **Performance**: Debounced search input (250ms default)
- **Error Resilience**: Comprehensive error handling at multiple levels

## Prerequisites

- **Bun** v1.3.5 or higher ([Installation Guide](https://bun.sh/docs/installation))
- **Operating System**: macOS, Linux, or Windows with WSL

To verify your Bun installation:

```bash
bun --version
```

## Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/rhuanbarreto/unleash-interview.git
cd unleash-interview

# Install dependencies
bun install
```

This will install:

- `react` and `react-dom` (v19)
- `trie-search` (v2.2.1)
- TypeScript type definitions

## Development

### Starting the Development Server

```bash
bun dev
```

This command will:

1. Install any missing dependencies
2. Start the development server with hot module replacement
3. Open the application at `http://localhost:3000` (or next available port)
4. Watch for file changes and automatically reload

The development server includes:

- **Hot Module Replacement (HMR)**: Instant updates without full page reload
- **Browser Console Mirroring**: Server logs browser console output
- **TypeScript Compilation**: Automatic transpilation on the fly
- **CSS Processing**: Instant style updates

### Development Workflow

1. Make changes to any `.ts`, `.tsx`, `.css`, or `.html` file
2. Save the file - changes appear instantly in the browser
3. Check the terminal for any TypeScript errors or server logs

### Available Scripts

```bash
# Development server with HMR
bun dev

# Run tests
bun test

# Run tests in watch mode
bun test --watch

# Type check the codebase
bun run typecheck

# Lint the codebase
bun run lint

# Build for production
bun run build

# Start production server
bun start
```

## Testing

The project uses Bun's built-in test runner for fast, reliable testing.

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode (re-runs on file changes)
bun test --watch

# Run tests with coverage
bun test --coverage
```

### Test Suite

The project includes **67 tests across 11 test files**, providing comprehensive coverage:

**Test Files:**

- `src/api/searchService.test.ts` - Core search logic and Trie implementation
- `src/frontend/App.test.tsx` - Main application component
- `src/frontend/helpers/useDebounce.test.ts` - Debounce hook functionality
- `src/frontend/components/SearchBar.test.tsx` - Search input component
- `src/frontend/components/SearchHint.test.tsx` - Minimum character hint
- `src/frontend/components/ResultsTable.test.tsx` - Results display
- `src/frontend/components/NoResults.test.tsx` - Empty state component
- `src/frontend/components/LoadingState.test.tsx` - Loading indicator
- `src/frontend/components/ErrorState.test.tsx` - Error message display
- `src/frontend/components/ErrorBoundary.test.tsx` - Error boundary component
- `src/index.test.ts` - Server, routing, and health check tests

**Test Coverage Includes:**

- **Minimum Length Validation**: Ensures 3-character minimum is enforced
- **Multi-field Search**: Tests across street names, cities, and postal codes
- **Case Insensitivity**: Verifies searches work with any casing
- **Partial Matching**: Tests prefix and substring matching
- **Result Structure**: Validates response object shape
- **Component Rendering**: Tests React component behavior and UI states
- **User Interactions**: Tests input handling and event callbacks
- **Edge Cases**: Empty strings, special characters, non-existent terms
- **Result Limits**: Ensures proper result count handling

Example test output:

```
bun test v1.3.5

 66 pass
 0 fail
 121 expect() calls
Ran 67 tests across 11 files. [2.22s]
```

## Building for Production

### Build Process

```bash
bun run build
```

This compiles the entire application into a single standalone executable in the `dist/` directory:

- **Single Binary**: All code (server + frontend) compiled into one executable
- **No Dependencies Required**: The executable runs without needing Bun or Node.js installed
- **Environment Variables**: `NODE_ENV` set to `"production"` at compile time
- **Platform-Specific**: The binary is compiled for your current platform (macOS, Linux, or Windows)

Build output structure:

```
dist/
└── app    # Standalone executable
```

### Build Configuration

The build process (defined in `package.json`):

```json
{
  "build": "bun build ./src/index.ts --compile --outfile ./dist/app --define:process.env.NODE_ENV='\"production\"'"
}
```

Options explained:

- `--compile`: Compile to a standalone executable
- `--outfile ./dist/app`: Output executable path
- `--define`: Set environment variable at compile time

## Running in Production

### Standard Production Deployment

```bash
# Build and start the production server
bun start
```

This command will:

1. Compile the application to a standalone executable
2. Make the executable runnable (`chmod +x`)
3. Run the compiled application

The production server:

- Runs on `http://localhost:3000` by default (configurable via PORT environment variable)
- Disables HMR and development features
- Uses `NODE_ENV=production` for performance optimizations
- **Does not require Bun or Node.js** to be installed where the executable runs

### Production Server Configuration

The server automatically detects production mode via `NODE_ENV`:

```typescript
// src/index.ts
development: process.env.NODE_ENV !== "production" && {
  hmr: true,
  console: true,
};
```

### Environment Variables

For development, create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
```

For production, set environment variables when running the executable:

```bash
PORT=8080 ./dist/app
```

**Note**:

- Bun automatically loads `.env` files in development
- `NODE_ENV=production` is compiled into the executable at build time
- The compiled executable does not load `.env` files - set environment variables directly

### Deployment Options

#### Option 1: Using the Compiled Executable (Recommended)

```bash
# Build the executable
bun run build

# Run the executable directly
./dist/app
```

The compiled binary can be copied to any server with the same OS/architecture and run directly without any dependencies.

#### Option 2: Direct Bun Server (Development/Testing)

```bash
# Run directly with Bun (requires Bun installed)
NODE_ENV=production bun src/index.ts
```

#### Option 3: Docker Deployment

```dockerfile
FROM oven/bun:1.3.5-slim AS base

ENV NODE_ENV=production

WORKDIR /app
COPY . .
RUN bun install

RUN bun build ./src/index.ts --compile --sourcemap --outfile ./dist/app --define:process.env.NODE_ENV='"production"'

FROM gcr.io/distroless/base-nossl-debian11 AS runtime
ENV NODE_ENV=production
EXPOSE 3000

COPY --from=base /app/dist/app /usr/local/bin/

CMD ["app"]
```

#### Option 4: Cloud Platforms

- **Railway/Render/Fly.io**: Upload the compiled binary directly
- **AWS/Azure/GCP**: Deploy the executable on VMs or containers
- **Traditional VPS**: Copy the binary and run with systemd or similar

### Production Checklist

Before deploying to production:

- [x] Run `bun test` to ensure all tests pass (67 tests passing)
- [x] Input sanitization with `Bun.escapeHTML()` implemented
- [x] Rate limiting configured (100 req/min per IP)
- [x] Structured logging with timestamps and metadata
- [x] Health check endpoint for monitoring (`/health`)
- [x] Error handling and error boundaries
- [ ] Build the application with `bun run build`
- [ ] Test the compiled executable locally with `./dist/app`
- [ ] Verify the executable works on the target platform/OS
- [ ] Configure SSL/HTTPS (use reverse proxy like nginx/caddy)
- [ ] Configure PORT environment variable if needed
- [ ] Set up external monitoring service (optional)
- [ ] Configure error tracking service like Sentry (optional)

## API Documentation

### Endpoints

#### `GET /health`

Health check endpoint for monitoring and load balancer checks.

**Response:**

```json
{
  "status": "ok",
  "uptime": 123.456
}
```

**Status Codes:**

- `200 OK`: Service is healthy

---

#### `GET /search/:term`

Search for Norwegian addresses by street name, postal code, or city.

**Parameters:**

- `term` (string, path parameter): Search query term (minimum 3 characters, maximum 100 characters)

**Response:**

```typescript
// Success
Array<{
  street: string; // Street name
  postNumber: number; // Norwegian postal code (4-5 digits)
  city: string; // City name
}>;

// Error
{
  error: string; // Error message
}
```

**Example Request:**

```bash
curl http://localhost:3000/search/oslo
```

**Example Success Response:**

```json
[
  {
    "street": "Oslo Sentrum Postboks 1",
    "postNumber": 101,
    "city": "OSLO"
  },
  {
    "street": "Sentrum Postboks 10",
    "postNumber": 102,
    "city": "OSLO"
  }
]
```

**Example Error Response:**

```json
{
  "error": "Search term contains invalid characters"
}
```

**Input Sanitization:**

- Search terms are sanitized using `Bun.escapeHTML()` to prevent XSS attacks
- Minimum 3 characters required (enforced by search service)
- Leading and trailing whitespace is automatically trimmed by the browser

**Search Behavior:**

- Case-insensitive search
- Prefix matching across all fields (street, postal code, city)
- Maximum 20 results returned
- Results are deduplicated by `postNumber + city + typeCode`

**Status Codes:**

- `200 OK`: Successful search (including empty results)
- `400 Bad Request`: Invalid search term (validation failed)
- `429 Too Many Requests`: Rate limit exceeded (100 requests/minute)
- `500 Internal Server Error`: Server error during search

**Rate Limiting:**

- 100 requests per minute per IP address
- Returns `429 Too Many Requests` when exceeded
- Includes `Retry-After` header with seconds to wait

## Performance Considerations

### Search Performance

- **Trie Data Structure**: O(m) search complexity where m = query length
- **Indexed Fields**: Street, postal code, and city for fast lookups
- **Result Limiting**: Maximum 20 results to prevent overwhelming UI
- **Minimum Query Length**: 3 characters reduces unnecessary searches

### Frontend Performance

- **Debounced Input**: 250ms delay prevents excessive API calls
- **Component Optimization**: Memoization where beneficial
- **Conditional Rendering**: Only render results when relevant

### Server Performance

- **Bun Runtime**: 3x faster than Node.js in many benchmarks
- **Single Thread**: Efficient event loop for I/O operations
- **Hot Module Replacement**: Development-only feature (disabled in production)

## Data Source

The application uses a JSON dataset of Norwegian addresses (`src/api/data/adresses.json`). The data includes:

- Street names (including PO boxes)
- 4-5 digit postal codes
- City names
- Additional metadata (typeCode, etc.)

## Browser Support

- Chrome/Edge (90+)
- Firefox (88+)
- Safari (14+)
- Modern mobile browsers

The application uses modern JavaScript features (ES2020+) and assumes a recent browser environment.

## TypeScript Configuration

The project uses strict TypeScript settings for maximum type safety:

```json
{
  "strict": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true
}
```

Path aliases configured:

- `@/*` → `./src/*`
- Direct imports from `src/` (e.g., `src/api/data/adresses.json`)

## Troubleshooting

### Common Issues

**Issue**: `bun: command not found`

- **Solution**: Install Bun from https://bun.sh

**Issue**: Port already in use

- **Solution**: Bun will automatically try the next available port, or set `PORT` environment variable

**Issue**: TypeScript errors

- **Solution**: Run `bun install` to ensure all type definitions are installed

**Issue**: Tests failing

- **Solution**: Ensure data file exists at `src/api/data/adresses.json`

**Issue**: Build fails

- **Solution**: Check TypeScript errors with `bun run typecheck`

**Issue**: Compiled executable won't run

- **Solution**: Ensure you have execute permissions (`chmod +x ./dist/app`) and the binary is for your OS/architecture

**Issue**: Production executable not starting

- **Solution**: Run from project root or ensure the executable can access required files. Check that the build completed successfully.

## Contributing

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Run tests before committing
- Use meaningful commit messages

### Adding Features

1. Create a new branch
2. Implement feature with tests
3. Ensure all tests pass
4. Update documentation if needed
5. Submit pull request

## License

This project is private and created for the Unleash technical interview.

## Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Trie Data Structure](https://en.wikipedia.org/wiki/Trie)

## Project Metadata

- **Created**: Using `bun init` with Bun v1.3.5
- **Last Updated**: January 2025
- **Author**: Unleash Technical Interview Candidate
- **Purpose**: Technical interview assessment

---

For questions or issues, please refer to the project repository or contact the maintainer.
