# Sezzle Calculator Challenge

A full-stack calculator for the Sezzle technical take-home challenge. A responsive React frontend consumes a Go REST API for addition, subtraction, multiplication, and division. The backend uses only the Go standard library.

## Technology stack and structure

- Backend: Go, net/http, encoding/json, testing, and httptest.
- Frontend: React, TypeScript, Vite, responsive CSS, Vitest, and React Testing Library.

```text
backend/
  go.mod
  main.go                         Server configuration and startup
  internal/calculator/            Arithmetic and unit tests
  internal/httpapi/               JSON handlers, CORS, and HTTP tests
frontend/
  src/App.tsx                    Request lifecycle and application state
  src/components/                Accessible form and result presentation
  src/api/                       Typed fetch client and API tests
  src/validation/                Operand validation and unit tests
  src/test/                      Testing Library setup
docs/prompts.md                   Actual development prompts
```

## Prerequisites and execution

Go 1.22 or later is required. Validation uses Go 1.27.3 on Windows/amd64. There are no external Go dependencies and no dependency installation step. From the repository root:

```sh
cd backend
go run .
```

The server listens on port 8080. Stop it with Ctrl+C. ALLOWED_ORIGIN optionally sets the single browser origin allowed by CORS; its default is http://localhost:5173. For example, in PowerShell before starting the server:

```powershell
$env:ALLOWED_ORIGIN = 'http://localhost:5173'
```

### Frontend

Use Node.js 22.12+ on the 22.x line or Node.js 24.x (validated with Node 24.22.1 and npm 11.19.1). The installed Vite 8.3.6 and React plugin 6.2.1 accept Node `^20.19.0 || >=22.12.0`; Vitest 5.1.0 accepts `^22.12.0 || ^24.0.0 || >=26.0.0`. Node 20 is therefore not supported by this project's test toolchain.

In a second terminal, from the repository root:

```sh
cd frontend
npm ci
npm run dev
```

Open http://localhost:5173 while the Go backend is running on port 8080. Vite uses a strict port so an occupied port cannot silently change the browser origin and break CORS. On Windows, use `npm.cmd` instead of `npm` if PowerShell execution policy blocks npm.ps1; no execution policy changes are required.

The default API base URL is http://localhost:8080. To override it, copy `frontend/.env.example` to `frontend/.env.local`, set `VITE_API_BASE_URL`, and restart Vite. Vite environment values are public and embedded at build time; never store secrets in them. If you use a different browser origin, configure the existing backend's ALLOWED_ORIGIN accordingly.

For a production build and local preview, run `npm run build` and `npm run preview` from frontend/. The build is written to dist/. The preview uses port 5173; stop the development server before running it.

## API contract

POST http://localhost:8080/api/v1/calculate with Content-Type: application/json (an optional charset parameter is accepted).

```json
{"operation":"add","a":10,"b":5}
```

Successful response: 200 OK:

```json
{"result":15}
```

PowerShell example:

```powershell
Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/calculate' -Method Post -ContentType 'application/json' -Body '{"operation":"divide","a":7,"b":2}'
```

The result is 3.5. Allowed operations are exactly add, subtract, multiply, and divide (case sensitive). All fields are required; operands must be JSON numbers. Missing or null fields are rejected, while zero is valid. Numeric strings, unknown fields, malformed JSON, and trailing content are rejected. The body limit is 4096 bytes.

Errors consistently use this envelope, with an English message and a stable machine-readable code:

```json
{"error":{"code":"division_by_zero","message":"Division by zero is not allowed."}}
```

| HTTP status | Error codes |
| --- | --- |
| 400 | invalid_request, missing_field, invalid_field, invalid_number |
| 404 | not_found |
| 405 | method_not_allowed (with Allow: POST, OPTIONS) |
| 413 | request_too_large |
| 415 | unsupported_media_type |
| 422 | unsupported_operation, division_by_zero, non_finite_result |
| 500 | internal_error (defensive fallback for unexpected calculation errors) |

All response bodies are JSON; valid CORS preflight responses are empty with status 204. Validation checks request format and fields before the operation and calculation. Only the first detected error is returned.

## Design decisions and limitations

- Arithmetic is independent of HTTP. The transport package validates requests and translates domain errors into responses. There are no external dependencies, database, authentication, or optional operations.
- Operands and results use float64. Decimal and exponent notation are accepted. Binary rounding is intentional: 0.1 + 0.2 may return 0.30000000000000004; the API does not round results. Underflow follows float64 behavior and can yield zero. This is not an exact financial arithmetic API.
- Out-of-range operands are rejected with 400; non-finite calculation results with 422. JSON does not allow NaN or Infinity. Division by positive or negative zero returns 422.
- CORS permits only the configured exact origin, POST, and the Content-Type request header. Wildcard origins and credentials are disabled. Allowed-origin error responses also receive CORS headers. Preflight varies by origin, requested method, and requested headers. Requests without an allowed origin receive no CORS permission; CORS is browser policy, not authentication.
- The server sets read, header, write, and idle timeouts. TLS and production deployment configuration are outside scope.
- No go.sum is needed while only standard-library packages are used. Dependency manifests and lockfiles remain trackable; generated coverage and binaries are ignored.
- The frontend uses local React state, a dedicated fetch client, and no router, UI framework, or global state dependency. React and React DOM are the only runtime dependencies. Dependency versions are resolved in package-lock.json; use npm ci for reproducible installation.
- The form accepts signed decimal numbers and exponent notation, rejects empty/non-finite input, and converts validated values to JSON numbers. Decimal commas and hexadecimal input are rejected. Arithmetic rules, including division by zero and overflow, remain in Go. Results are shown without additional rounding.
- Submission disables the form and uses an immediate ref guard to prevent duplicate requests before React renders. Requests are aborted on unmount; aborted responses do not update state. Starting another calculation clears the prior result. A completed result retains the submitted operands even if inputs are edited afterward.
- API errors preserve HTTP status and the structured code/message. The interface displays the backend message; connection failures and malformed responses receive clear fallback messages. Native labels, radio controls, keyboard focus indicators, associated validation messages, and live result/loading regions support accessibility.

## Tests, static checks, and coverage

Run from backend/:

```sh
go test ./...
go test -cover ./...
go vet ./...
go build ./...
go test '-coverprofile=coverage.out' ./...
go tool cover '-func=coverage.out'
go tool cover '-html=coverage.out' -o coverage.html
```

The generated coverage.out and coverage.html files are local artifacts excluded from Git. Unit tests cover arithmetic, precision, invalid operations, non-finite operands, zero divisors, overflow, and underflow. HTTP tests cover validation, response envelopes, limits, routing, content types, body read failure, and CORS including rejected preflights.

Backend validation from the backend stage: all tests passed; go vet and go build passed. Statement coverage: calculator 100.0%, httpapi 98.8%, main 0.0%, total 93.1%. The uncovered HTTP branch is the defensive internal-error fallback; current domain errors reachable through validated requests are covered. Server startup is not exercised by unit tests. These backend checks were not rerun for the frontend-only change. Owner review is required before publication or merge.

The initial test attempt could not access the Go build cache in the restricted environment; validation succeeded with authorized cache access. PowerShell also split unquoted coverage arguments containing a dot; quoting the full arguments as shown above corrected report generation.

### Frontend validation

Run from frontend/:

```sh
npm test
npm run typecheck
npm run test:coverage
npm run build
```

Measured results: 54 tests passed across 3 files; TypeScript checks and the production build passed. A clean npm ci installation also succeeded with 0 reported vulnerabilities. Vite served the application HTML with HTTP 200 on port 5173; the temporary server was stopped after verification. V8 coverage: statements 98.66% (74/75), branches 95.38% (62/65), functions 100% (16/16), lines 100% (58/58). The client and operand validation both have 100% coverage in all four metrics. Coverage includes application, components, HTTP client, and validation; the bootstrap entry point, declarations, test setup, tests, and CSS are excluded. Defensive cancellation/fallback and submission guard paths account for uncovered branches/statements.

HTML and JSON coverage reports are generated in frontend/coverage/ and excluded from Git. Tests use simulated fetch responses and user interactions to cover all four operations, validation, zero results, HTTP errors, bad responses, connection failure, loading, retries, duplicate prevention, stale-result clearing, and cancellation on unmount.

Initial validation exposed a mock reusing an already-consumed Response body; the test now makes both assertions against one promise. The first dependency selection reported 7 development-tool vulnerabilities; updating Vite, Vitest, coverage, and the React plugin resolved them (installation audit: 0 vulnerabilities). A temporary peer-resolution conflict was resolved with npm update, without force or legacy-peer-deps. Test/build tooling required authorized filesystem access outside the restricted runner.

Visual appearance, mobile layout, screen-reader behavior, and browser-to-Go CORS integration still require manual browser review. jsdom tests do not verify those browser behaviors, and no end-to-end browser suite was added.

npm reports a deprecation warning for the transitive jsdom dependency whatwg-encoding; installation succeeds and the final audit reports no vulnerabilities.
