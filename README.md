# Sezzle Calculator Challenge

A full-stack calculator project for the Sezzle technical take-home challenge. The planned application will use a React frontend and a Go REST API to support addition, subtraction, multiplication, and division, with input validation and clear error handling.

## Planned technology stack

- Frontend: React, TypeScript, Vite, and responsive CSS.
- Frontend testing: Vitest and React Testing Library.
- Backend: Go with the standard library, including `net/http` and `testing`.
- API: REST with JSON request and response bodies.

## Current status

Only the repository structure and initial documentation are present. No dependencies have been installed, no React application or Go module has been generated, and no calculator functionality has been implemented.

```text
frontend/       Reserved for the React application
backend/        Reserved for the Go API
docs/prompts.md Actual AI development prompts and outcomes
AGENTS.md       Repository working instructions
.gitignore      Local and generated file exclusions
README.md       Project overview and current status
```

The frontend and backend directories contain `.gitkeep` placeholders so Git can track the otherwise empty directories. Their internal structure will be defined when implementation begins.

## Setup and execution

Runtime versions and installation prerequisites have not yet been defined. Installation and execution instructions will be added when the applications are configured and the commands can be verified.

## API, tests, and coverage

No API endpoints or request and response contracts exist yet. API examples, test commands, coverage generation instructions, and measured coverage results will be documented after implementation and validation. No tests, builds, or coverage measurements are currently available.

## Design decisions and limitations

The frontend and backend are kept in separate directories to support independent development and testing. This initial structure deliberately contains no application scaffolding, dependency manifests, database, authentication, or infrastructure configuration.

Dependency manifests and lockfiles will be tracked when introduced. Local environment files and generated artifacts are excluded by `.gitignore`; `.env.example` is allowed for future configuration documentation.
