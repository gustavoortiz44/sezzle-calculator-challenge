# Sezzle Calculator Challenge — Agent Instructions

## 1. Project Objective

Build a professional, clean, maintainable, and testable full-stack calculator application for the Sezzle technical take-home challenge.

The application must provide a React frontend that consumes a Go REST API to perform arithmetic operations.

The primary evaluation priorities are:
- Correctness and reliability.
- Clean, readable, idiomatic code.
- Maintainable and testable architecture.
- Appropriate input validation and error handling.
- Clear documentation and reproducible setup.
- Responsible use of AI development tools.

The assignment recommends approximately 2–4 hours of development. Prioritize required functionality over unnecessary complexity or optional features.

## 2. Technology Stack

### Frontend
- React.
- TypeScript.
- Vite.
- Vitest.
- React Testing Library.
- Responsive CSS.

### Backend
- Go.
- Standard library (`net/http`).
- Go standard testing package.
- REST API with JSON request and response bodies.

### Development
- Git and GitHub.
- VS Code.
- OpenAI Codex.
- GitHub Actions for automated validation when configured.

Do not replace these technologies without explicit user approval.

## 3. Functional Requirements

Required operations:
- Addition.
- Subtraction.
- Multiplication.
- Division.

Optional operations:
- Exponentiation.
- Square root.
- Percentage.

The frontend must:
- Provide an intuitive calculator interface.
- Validate user input.
- Display calculation results.
- Handle API errors gracefully.
- Support basic mobile responsiveness.

The backend must:
- Expose REST endpoints for calculator operations.
- Validate incoming data.
- Handle division by zero.
- Reject invalid or unsupported operations.
- Return consistent JSON responses.
- Use appropriate HTTP status codes.

Optional features must never delay or compromise required functionality.

## 4. Architecture Guidelines

- Maintain separate `frontend/` and `backend/` directories.
- Separate HTTP handlers from calculator business logic.
- Keep arithmetic operations independently testable.
- Prefer small, focused React components.
- Keep API communication separate from presentation logic.
- Use descriptive naming and clear interfaces.
- Avoid unnecessary abstractions and premature optimization.
- Do not introduce a database, authentication, or distributed infrastructure.
- Prefer idiomatic Go and TypeScript.
- Avoid adding dependencies without clear justification.

Architecture decisions must remain proportional to the challenge's scope.

## 5. Code Quality Standards

- Write clean, readable, and maintainable code.
- Use consistent naming conventions.
- Keep functions and components focused.
- Avoid duplicated business logic.
- Validate inputs at appropriate boundaries.
- Handle errors explicitly.
- Avoid unnecessary comments.
- Do not introduce dead code or unused dependencies.
- Do not silently change existing behavior.
- Explain significant technical decisions.

## 6. Testing and Coverage Requirements

Testing is mandatory for both frontend and backend.

### Backend Testing
- Use Go's standard `testing` package.
- Test all required arithmetic operations.
- Test division by zero.
- Test invalid input.
- Test relevant boundary conditions.
- Test API handlers and HTTP responses.

### Frontend Testing
- Use Vitest and React Testing Library.
- Test essential user interactions.
- Test input validation.
- Test result rendering.
- Test API error handling.
- Mock network requests where appropriate.

### Coverage
- Generate coverage reports for both layers.
- Document how to reproduce coverage results.
- Report actual measured coverage.
- Never fabricate coverage percentages.
- Do not introduce arbitrary coverage claims.

### Pull Request Quality Gate
A Pull Request must not be considered ready for merge unless:

1. Relevant automated tests have been executed.
2. Required tests have passed.
3. Coverage reports have been generated and reviewed.
4. Applicable build and static checks have passed.
5. No known blocking defects remain.
6. The agent has documented test results and limitations.
7. The repository owner has reviewed the changes.

If tests cannot be executed, the agent must explain why and mark the Pull Request as not ready for merge.

Passing tests does not automatically authorize a merge.

## 7. Git Workflow and Ownership

### Branch Strategy
- `main` represents the stable, deliverable version.
- Never implement features directly on `main`.
- Create short-lived branches from the latest `origin/main`.
- Use descriptive branch names.

Examples:
- `feat/backend-calculator`
- `feat/frontend-calculator`
- `test/calculator-coverage`
- `docs/project-documentation`

### Commits
- Follow Conventional Commits.
- Keep commits focused and logically organized.
- Do not create commits without explicit user approval.
- Never include credentials, secrets, or unnecessary generated files.
- Do not rewrite published history.

### Pull Requests
- All implementation changes must reach `main` through Pull Requests.
- Never push implementation changes directly to `main`.
- The agent may prepare and propose Pull Requests.
- Creating or publishing a Pull Request requires explicit user approval.
- Every Pull Request must document:
  - Summary of changes.
  - Technical rationale.
  - Tests executed and their results.
  - Coverage information.
  - Known limitations or risks.

### Merge Policy
- Only the repository owner is authorized to merge Pull Requests.
- The agent must never merge or close Pull Requests.
- Never enable or perform automatic merges.
- Never bypass branch protection rules.
- Never force-push to `main`.
- Wait for explicit user approval before publishing changes.
- Successful tests do not constitute merge authorization.

### Initial Setup Exception
The repository owner may authorize the initial scaffolding commit directly to `main`.

After initial setup, all changes must follow the Pull Request workflow.

## 8. Security Guidelines

- Never commit secrets, tokens, passwords, or credentials.
- Never commit local `.env` files.
- Use `.env.example` for documented configuration when needed.
- Avoid unnecessary external services.
- Do not access or modify files outside this repository.
- Request approval before destructive operations.
- Request approval before installing major dependencies.
- Never execute destructive Git commands without explicit approval.

## 9. Documentation Requirements

Maintain clear English-language documentation.

### README.md
Include:
- Project overview.
- Technology stack.
- Prerequisites.
- Installation instructions.
- How to run the frontend.
- How to run the backend.
- API request and response examples.
- How to execute tests.
- How to generate coverage reports.
- Design decisions and assumptions.
- Known limitations.

### AI Prompt Documentation
Record the actual prompts used during development in `docs/prompts.md`.

Include:
- The original prompt.
- Its purpose.
- Relevant implementation outcome.
- Any significant follow-up instructions.

Do not fabricate prompts or claim AI interactions that did not occur.

## 10. Agent Working Agreement

### Before Implementation
1. Inspect the relevant repository files.
2. Understand the current architecture.
3. Explain the proposed changes.
4. Identify assumptions or risks.
5. Wait for user approval before major architectural changes.

### During Implementation
1. Work only on the assigned task.
2. Respect existing project conventions.
3. Keep changes focused.
4. Avoid unrelated refactoring.
5. Add or update relevant tests.
6. Do not publish changes without authorization.

### After Implementation
1. Run relevant automated tests.
2. Run applicable build and static checks.
3. Generate or update coverage reports.
4. Summarize modified files.
5. Explain important design decisions.
6. Report failures and known limitations.
7. Request approval before commits, pushes, or Pull Requests.
8. Never merge changes.

## 11. Communication Standards

- Communicate with the repository owner in Spanish.
- Write source code and identifiers in English.
- Write commit messages in English.
- Write technical documentation in English.
- Provide concise, clear technical explanations.
- Never claim an operation succeeded without verification.

## 12. Definition of Done

A task is considered complete only when:
- Its required functionality is implemented.
- Relevant validation and error handling are present.
- Appropriate tests have passed.
- Applicable builds and checks have passed.
- Coverage results have been reported.
- Documentation has been updated when necessary.
- Changes have been reviewed by the repository owner.

A Pull Request is ready for merge only after the quality gates are satisfied and the owner has reviewed it.

The final merge decision always belongs to the repository owner.