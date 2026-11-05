# Sezzle Calculator Challenge

A full-stack calculator for the Sezzle technical take-home challenge. The Go REST API implements addition, subtraction, multiplication, and division using only the standard library. The React frontend has not been implemented.

## Technology stack and structure

- Backend: Go, net/http, encoding/json, testing, and httptest.
- Planned frontend: React, TypeScript, Vite, responsive CSS, Vitest, and React Testing Library.

```text
backend/
  go.mod
  main.go                         Server configuration and startup
  internal/calculator/            Arithmetic and unit tests
  internal/httpapi/               JSON handlers, CORS, and HTTP tests
frontend/.gitkeep                 Frontend placeholder
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

No frontend setup or execution commands are available yet.

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

Measured validation: all tests passed; go vet and go build passed. Statement coverage: calculator 100.0%, httpapi 98.8%, main 0.0%, total 93.1%. The uncovered HTTP branch is the defensive internal-error fallback; current domain errors reachable through validated requests are covered. Server startup is not exercised by unit tests. Frontend tests and coverage remain pending implementation. Owner review is required before publication or merge.

The initial test attempt could not access the Go build cache in the restricted environment; validation succeeded with authorized cache access. PowerShell also split unquoted coverage arguments containing a dot; quoting the full arguments as shown above corrected report generation.
